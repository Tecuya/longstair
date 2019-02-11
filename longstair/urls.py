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
]

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
