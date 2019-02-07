from django.contrib import admin
from django.conf import settings
from django.urls import path, re_path

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
    path('xhr/relations/<slug>', forest.views.xhr_relations, name='xhr_relations_for_slug'),
    path('xhr/relations/<slug>/<text>', forest.views.xhr_relations, name='xhr_relations_for_text')
]

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
