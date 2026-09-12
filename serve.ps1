param(
  [int]$Port = 3000
)

$root = $PSScriptRoot
$prefix = "http://localhost:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host ""
Write-Host "  Portfolio running at $prefix"
Write-Host "  Press Ctrl+C to stop"
Write-Host ""

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".pdf"  = "application/pdf"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
}

function Get-SafePath([string]$urlPath) {
  $decoded = [System.Uri]::UnescapeDataString($urlPath)
  if ([string]::IsNullOrWhiteSpace($decoded) -or $decoded -eq "/") {
    return (Join-Path $root "index.html")
  }
  $relative = $decoded.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
  $full = [IO.Path]::GetFullPath((Join-Path $root $relative))
  $rootFull = [IO.Path]::GetFullPath($root)
  if (-not $full.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) {
    return $null
  }
  return $full
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $file = Get-SafePath $request.Url.AbsolutePath

    if ($null -eq $file -or -not (Test-Path -LiteralPath $file -PathType Leaf)) {
      $response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("Not found")
      $response.ContentType = "text/plain; charset=utf-8"
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }

    $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
    $response.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" })
    $bytes = [IO.File]::ReadAllBytes($file)
    $response.ContentLength64 = $bytes.Length
    $response.StatusCode = 200
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
