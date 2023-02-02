var client_id = '19d133ac10a4475f9d4e8c2efe3c6231'
var redirect_uri = 'https://interactions.zymf.repl.co/intermittent.html'
var scopes = 'user-top-read'

function getDetails(url) {
  return fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer BQDy6WBNKCijvg8pEiv2VOhZzvfBQUC37NqAArTTWZAAUh2aUm_bxu_hOay3n4Aryllbx8w_X6taJ8oCvhRhvXWHdAUso0Cj-34r6MezJxujtfpzhX5lV00CdsFNUxO37NSh8FDlBCri03TLXlftXykm5I_FPx73E8CWuXgZDNp7Ovb5Bd8-zrORHNsOM2JJnlMLqPZosqo",
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
}

var url = "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10";
getDetails(url).then(function(data) {
    console.log(data);
})