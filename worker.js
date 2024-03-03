addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  let domainList = null;
  
  async function getDomainList() {
    const response = await fetch('https://raw.githubusercontent.com/lepasid/blocklist/main/domains');
    const text = await response.text();
    domainList = text.split('\n');
    return domainList;
  }
  
  async function handleRequest(request) {
    const url = new URL(request.url);
    const refreshCache = url.searchParams.get('refresh');
  
    if (refreshCache === 'true') {
      await getDomainList();
      return new Response('Cache Refreshed!');
    }
  
    const domains = await getDomainList();
    const domainsParam = url.searchParams.get('domains');
    const domainParam = url.searchParams.get('domain');
  
    if (domainsParam && domainParam) {
      return new Response('Both domains and domain parameters cannot be provided simultaneously.', { status: 400 });
    }
  
    if (domainsParam) {
      const domainArray = domainsParam.split(',');
      const responseObj = {};
  
      domainArray.forEach(domain => {
        const isBlocked = domains.includes(domain.trim());
        responseObj[domain.trim()] = { blocked: isBlocked };
      });
  
      const jsonResponse = url.searchParams.get('json') === 'true';
  
      if (jsonResponse) {
        return new Response(JSON.stringify(responseObj), {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        let plaintextResponse = '';
        for (const domain in responseObj) {
          plaintextResponse += `${domain}: ${responseObj[domain].blocked ? 'Blocked' : 'Not Blocked'}!\n`;
        }
        return new Response(plaintextResponse);
      }
    }
  
    const requestedDomain = domainParam;
  
    if (!requestedDomain) {
      return new Response('Domain parameter not provided.', { status: 400 });
    }
  
    const isBlocked = domains.includes(requestedDomain);
    const jsonParam = url.searchParams.get('json');
    const jsonResponse = jsonParam !== null && jsonParam.toLowerCase() === 'true';
  
    if (jsonResponse) {
      return new Response(JSON.stringify({ blocked: isBlocked }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(`${requestedDomain}: ${isBlocked ? 'Blocked' : 'Not Blocked'}!`);
    }
  }  