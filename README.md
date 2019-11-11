# ESD Reflections

## Getting started

### 1. Get your Trello API Key
[https://trello.com/app-key](https://trello.com/app-key)

### 2. Add it to `index.html`
From:
```html
<script src="https://api.trello.com/1/client.js?key={API_KEY}"></script>
```

To:
```html
<script src="https://api.trello.com/1/client.js?key={fBm6He90bHidSmF68z82e07XbpElY6tB}"></script>
```

### 3. Start Python HTTP Server in `src` folder
```sh
cd src
http python3 -m http.server 8000
```