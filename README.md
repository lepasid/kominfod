# The Kominfod "API"
I'm using the term API broadly here, its just a Cloudflare worker  
This worker fetches from [lepasid/blocklist](https://github.com/lepasid/blocklist), and make it easier to access and search the massive amount of domains

### Make a Simple request
**cURL**
```
curl -X GET 'https://kominfod.mefi.workers.dev?domain=example.com'
```

Expected output:
```
example.com: Not Blocked!
```

### Batch Search domains
You can use the *domains* parameter to batch search domains, **PLEASE ONLY SEARCH UPTO 30 DOMAINS AT A TIME, THE CF WORKER CURRENTLY CAN BARELY PROCESS MORE THAN 30 DOMAINS AT ONCE**
**cURL**
```
curl -X GET 'https://kominfod.mefi.workers.dev?domains=example.com,reddit.com'
```

Expected output:
```
example.com: Not Blocked!
reddit.com: Blocked!
```

## Json Output
for people who want to use this "API", you can use the json parameter

**cURL**
```
curl -X GET 'https://kominfod.mefi.workers.dev?domain=example.com&json=true'
```

Expected output:
```
{"example.com":{"blocked":false}}
```

### For batch, the output is abit different

**cURL**
```
curl -X GET 'https://kominfod.mefi.workers.dev?domains=example.com,reddit.com&json=true'
```

Expected output:
```
{"example.com":{"blocked":false},"reddit.com":{"blocked":true}}
```

## Force Refresh
this is NOT needed at all since it terminates cache if its not used for an hour or so; i honestly dont know!. this is here if you see it not picking up a new blocked domain

**cURL**
```
curl -X GET 'https://kominfod.mefi.workers.dev?refresh=true'
```

Expected output:
```
Cache Refreshed!
```

# If you use this "API" regularly, i advise you to make your own CloudFlare worker
CloudFlare has a request limit, while it is generous, i still advise you to make your own CF worker, youre not the only person using this "API"  
The worker.js is in the repository, and PLEASE credit us; dont let the spirit of open source die out.  
This project is licensed under CC-BY-SA-4.0