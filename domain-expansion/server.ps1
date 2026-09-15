$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://127.0.0.1:8080/')
$listener.Start()
Write-Host "Server listening on http://127.0.0.1:8080/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') { $localPath = '/index.html' }
        
        $filePath = Join-Path "C:\Users\manik\.gemini\antigravity\scratch\domain-expansion" $localPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            if ($filePath.EndsWith('.html')) { $response.ContentType = 'text/html' }
            elseif ($filePath.EndsWith('.css')) { $response.ContentType = 'text/css' }
            elseif ($filePath.EndsWith('.js')) { $response.ContentType = 'text/javascript' }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    } catch {
        # ignore context errors
    }
}
