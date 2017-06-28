<!-- app/view/news/list.tpl -->
<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" />
  </head>
  <body>
    <div class="news-view view">
      {% for item in data %}
        <div class="item">
         {{ item.title }}
        </div>
      {% endfor %}
    </div>
  </body>
</html>