---
title: Welcome to my blog
layout: 'layouts/home.njk'
---
<ul>
    {% for post in collections.blog reversed %}
    <li><time>{{ post.date | isoDate }}</time>&ensp;<a href="{{post.url}}">{{post.data.title}}</a></li>
    {% endfor %}
</ul>