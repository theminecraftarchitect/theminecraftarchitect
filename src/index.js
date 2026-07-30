export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Normalize trailing slashes (but keep root as "/")
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    // ---- Permanent redirects: old URLs -> new canonical clean URLs ----
    const redirects = {
      '/nostalgic-seeds': '/mcpe-worlds',
      '/nostalgic-seeds/minecraft-pe-seeds': '/mcpe-worlds/mcpe-seeds',
      '/old-minecraft-worlds': '/java-edition-worlds',
      '/old-minecraft-worlds/trailers': '/java-edition-worlds/trailers',
      '/old-minecraft-worlds/mcpe-worlds': '/mcpe-worlds/mcpe-worlds',
      '/java-edition-worlds/mcpe-worlds': '/mcpe-worlds/mcpe-worlds',
    };
    if (redirects[path]) {
      return Response.redirect(url.origin + redirects[path] + url.search, 301);
    }

    // ---- Clean URL -> actual file (serves the file's content, keeps the
    // pretty URL in the address bar) ----
    const pageMap = {
      '/tutorial-worlds': '/tutorial-worlds.html',
      '/mini-game-maps': '/mini-game-hub.html',
      '/java-edition-worlds': '/java-edition-worlds-hub.html',
      '/mcpe-worlds': '/pe-worlds-hub.html',
      '/updates': '/updates.html',
      '/credits': '/credits.html',
      '/about': '/about.html',
      '/privacy': '/privacy.html',
      '/mini-game-maps/lobbies': '/mini-game-lobbies-list.html',
      '/java-edition-worlds/trailers': '/minecraft-trailers-list.html',
      '/java-edition-worlds/seeds': '/minecraft-seeds-list.html',
      '/java-edition-worlds/community-worlds': '/community-worlds-list.html',
      '/mcpe-worlds/mcpe-worlds': '/mcpe-worlds-list.html',
      '/mcpe-worlds/mcpe-seeds': '/pe-seeds-list.html',
    };
    if (pageMap[path]) {
      return env.ASSETS.fetch(new URL(pageMap[path], url.origin));
    }

    // ---- /tutorial-worlds/{slug} -> map.html ----
    // map.html's own script reads the slug from the URL path directly,
    // so no query string needs to be added here.
    let m = path.match(/^\/tutorial-worlds\/([a-z0-9-]+)$/i);
    if (m) {
      return env.ASSETS.fetch(new URL('/map.html', url.origin));
    }

    // ---- /mini-game-maps/{battle|tumble|glide} -> mini-game-list.html ----
    m = path.match(/^\/mini-game-maps\/(battle|tumble|glide)$/i);
    if (m) {
      return env.ASSETS.fetch(new URL('/mini-game-list.html', url.origin));
    }

    // Everything else (images, real filenames, anything not listed above)
    // falls through to normal static asset handling / 404.
    return env.ASSETS.fetch(request);
  }
};
