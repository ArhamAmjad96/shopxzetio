[CmdletBinding()]
param(
    [string]$ProjectRef
)

$ErrorActionPreference = 'Stop'

function ConvertFrom-SecureValue {
    param([Parameter(Mandatory)][Security.SecureString]$Value)

    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Value)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}

function Get-ProjectRefFromEnvironmentFile {
    $candidateFiles = @('.env.local', '.env.production', '.env')

    foreach ($file in $candidateFiles) {
        if (-not (Test-Path -LiteralPath $file)) {
            continue
        }

        $urlLine = Get-Content -LiteralPath $file |
            Where-Object { $_ -match '^\s*VITE_SUPABASE_URL\s*=' } |
            Select-Object -First 1

        if (-not $urlLine) {
            continue
        }

        $urlValue = ($urlLine -replace '^\s*VITE_SUPABASE_URL\s*=\s*', '').Trim().Trim('"').Trim("'")
        $supabaseUri = [Uri]$urlValue
        $hostParts = $supabaseUri.Host.Split('.')

        if ($hostParts.Count -ge 3 -and $hostParts[1] -eq 'supabase') {
            return $hostParts[0]
        }
    }

    throw 'Could not determine the Supabase project reference from VITE_SUPABASE_URL. Pass it with -ProjectRef.'
}

if (-not $ProjectRef) {
    $ProjectRef = Get-ProjectRefFromEnvironmentFile
}

$accessTokenSecure = Read-Host 'Supabase personal access token (from https://supabase.com/dashboard/account/tokens)' -AsSecureString
$smtpPasswordSecure = Read-Host 'Password for noreply@shopxzetio.com' -AsSecureString

$accessToken = $null
$smtpPassword = $null

try {
    $accessToken = ConvertFrom-SecureValue $accessTokenSecure
    $smtpPassword = ConvertFrom-SecureValue $smtpPasswordSecure

    if ([string]::IsNullOrWhiteSpace($accessToken)) {
        throw 'The Supabase personal access token cannot be empty.'
    }

    if ([string]::IsNullOrWhiteSpace($smtpPassword)) {
        throw 'The SMTP password cannot be empty.'
    }

    $payload = @{
        external_email_enabled               = $true
        mailer_secure_email_change_enabled  = $true
        mailer_autoconfirm                   = $false
        smtp_admin_email                     = 'noreply@shopxzetio.com'
        smtp_host                            = 'mail.shopxzetio.com'
        smtp_port                            = 465
        smtp_user                            = 'noreply@shopxzetio.com'
        smtp_pass                            = $smtpPassword
        smtp_sender_name                     = 'ShopXzetio'
    } | ConvertTo-Json

    $headers = @{
        Authorization = "Bearer $accessToken"
    }

    $endpoint = "https://api.supabase.com/v1/projects/$ProjectRef/config/auth"
    Invoke-RestMethod -Method Patch -Uri $endpoint -Headers $headers -ContentType 'application/json' -Body $payload | Out-Null

    Write-Host ''
    Write-Host 'Custom SMTP is now enabled for ShopXzetio.' -ForegroundColor Green
    Write-Host 'Sender: noreply@shopxzetio.com'
    Write-Host 'Server: mail.shopxzetio.com:465 (SSL/TLS)'
    Write-Host 'Next: send one password-reset email and confirm delivery.'
}
catch {
    Write-Host ''
    Write-Host 'Supabase did not accept the SMTP configuration.' -ForegroundColor Red

    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
        Write-Host "HTTP status: $([int]$_.Exception.Response.StatusCode)"
    }

    Write-Host $_.Exception.Message
    Write-Host 'Use a Supabase personal access token from the account that owns or administers this project.'
    exit 1
}
finally {
    $accessToken = $null
    $smtpPassword = $null
    $payload = $null
    $headers = $null
    [GC]::Collect()
}
