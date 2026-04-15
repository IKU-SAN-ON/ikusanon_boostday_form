server {
    listen 80 default_server;
    server_name _;
    server_tokens off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Error Handlers
    error_page 401 =401 @next_401;
    error_page 403 =403 @next_403;
    error_page 404 =404 @next_404;

    location /api/v1/internal {
        return 403;
    }

    location /error/ {
        internal;
        proxy_pass http://web:3000;
    }

    # Named location handlers
    location @next_401 {
        rewrite ^ /error/401 break;
        proxy_pass http://web:3000;
    }

    location @next_403 {
        rewrite ^ /error/403 break;
        proxy_pass http://web:3000;
    }

    location @next_404 {
        rewrite ^ /error/404 break;
        proxy_pass http://web:3000;
    }

    # Default App Traffic
    location / {
        proxy_pass http://web:3000;
    }
}
