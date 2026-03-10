---
title: Welcome to my blog
layout: 'layouts/home.html'
---

<ul>
  {% for post in collections.blog | reverse %}
  <li>
    <time>{{ post.date | isoDate }}</time>&ensp;
    <a href="{{ post.url }}">{{ post.data.title }}</a>
  </li>
  {% endfor %}
</ul>
