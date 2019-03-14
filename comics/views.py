from django.shortcuts import render

from comics.models import Comic


def comic(request, comic_id=None):

    first_comic = Comic.objects.filter(active=True).order_by('created')[0]
    last_comic = Comic.objects.filter(active=True).order_by('-created')[0]

    if comic_id is not None:
        comic = Comic.objects.get(id=comic_id)
    else:
        comic = last_comic

    next_comics = Comic.objects.filter(active=True, created__gt=comic.created).order_by('created')
    prev_comics = Comic.objects.filter(active=True, created__lt=comic.created).order_by('-created')

    ctx = {
        'comic': comic,
        'comic_next': next_comics[0] if len(next_comics) else None,
        'comic_prev': prev_comics[0] if len(prev_comics) else None,
        'comic_first': first_comic,
        'comic_last': last_comic
    }

    return render(request, 'comic.html', ctx)
