"""longstair URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, re_path, include

import comics.views
import forest.views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    path('admin/', admin.site.urls),

    path('', comics.views.comic),
    path('<int:comic_id>', comics.views.comic, name='comic'),

    re_path(r'^forest', forest.views.node, name='node'),

    path('xhr/relation_by_slug/<slug>', forest.views.xhr_relation_by_slug, name='xhr_relation_by_slug'),
    path('xhr/node_by_slug/<slug>', forest.views.xhr_node_by_slug, name='xhr_node_by_slug'),
    path('xhr/nodes_for_text/<text>', forest.views.xhr_nodes_for_text, name='xhr_nodes_for_text'),
    path('xhr/relations_for_parent_node/<slug>', forest.views.xhr_relations_for_parent_node, name='xhr_relations_for_parent_node'),
    path('xhr/fetch_relations_for_text/<slug>/<text>', forest.views.xhr_fetch_relations_for_text, name='xhr_fetch_relations_for_text')
]

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
