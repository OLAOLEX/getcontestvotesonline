export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol !== 'https:' || url.hostname === 'www.getcontestvotesonline.com') {
      url.protocol = 'https:';
      url.hostname = 'getcontestvotesonline.com';
      return Response.redirect(url.href, 301);
    }
    return env.ASSETS.fetch(request);
  }
};
