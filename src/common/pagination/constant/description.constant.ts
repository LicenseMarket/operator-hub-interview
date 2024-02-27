export const pageDescription = `
\n input's will be collected from request Query; 4 optional input:\n
page => numebr of page\n
limit => count of data in each page\n
orderBy => sort data base on provided argument\n
filter => filter data base on provided argument\n
search => search data base on provided argument\n
EXAMPLE => ?page=1&limit=10&orderBy={"name": "asc"}&filter={"name": "sa"}&search={"name": "sa"}\n
FULL URL => http://127.0.0.1:3000/api/v1/{APIADDRESS}?page=1&limit=10&orderBy={"name": "asc"}&orderBy={"id": "asc"}&filter={"name": "sa"}&search={"name": "sa"}\n
FULL URL V2 => http://127.0.0.1:3000/api/v1/{APIADDRESS}?page=1&limit=10&orderBy=[{"name": "asc"}]&filter=[{"name": "sa"}]&search=[{"name": "sa"}]
 `;
