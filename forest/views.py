from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotFound
import ujson

from .models import Node, Relation


def xhr_relation_by_slug(request, slug):

    if request.method == 'POST':
        doc = ujson.loads(request.body)

        nqs = Node.objects.filter(slug=doc['parent'])
        if len(nqs) == 0:
            return HttpResponseNotFound('<h1>No such parent</h1>')
        parent = nqs[0]

        nqs = Node.objects.filter(slug=doc['child'])
        if len(nqs) > 0:
            child = nqs[0]

        else:
            child, created = Node.objects.get_or_create(
                author=request.user,
                name=doc['child'],
                slug=doc['child'])

        relation, created = Relation.objects.get_or_create(
            author=request.user,
            slug=doc['slug'],
            parent=parent,
            child=child,
            text=doc['text'])

    else:
        return HttpResponseNotFound('<h1>No such relation</h1>')

    return JsonResponse(
        {'slug': relation.slug,
         'text': relation.text,
         'author': relation.author.username,
         'created': relation.created.strftime('%Y-%m-%d')},
        safe=False)


def xhr_node_by_slug(request, slug):
    nqs = Node.objects.filter(slug=slug)
    if nqs is None or len(nqs) == 0:
        return HttpResponseNotFound('<h1>No such node</h1>')

    node = nqs[0]

    if request.method == 'POST':
        doc = ujson.loads(request.body)
        node.name = doc['name']
        node.slug = doc['slug']
        node.text = doc['text']
        node.save()

    return JsonResponse(
        {'name': node.name,
         'slug': node.slug,
         'text': node.text,
         'author': node.author.username,
         'created': node.created.strftime('%Y-%m-%d')},
        safe=False)


def xhr_relations_for_parent_node(request, slug):
    return JsonResponse(
        [{'text': r.text,
          'slug': r.slug,

          'parent': r.parent.slug,
          'child': r.child.slug,

          'author': r.author.username,
          'created': r.created.strftime('%Y-%m-%d')}
         for r in Relation.objects.filter(parent__slug=slug)],
        safe=False)


def xhr_relations(request, slug, text=None):

    filters = {
        'parent__slug': slug
    }

    if text:
        filters['text__contains'] = text

    return JsonResponse(
        [{'text': r.text,
          'slug': r.slug,

          'parent': r.parent.slug,
          'child': r.child.slug,

          'author': r.author.username,
          'created': r.created.strftime('%Y-%m-%d')}
         for r in Relation.objects.filter(**filters)],
        safe=False)


def xhr_nodes_for_text(request, text):
    return JsonResponse(
        [{'name': n.name,
          'slug': n.slug,
          'author': n.author.username,
          'created': n.created.strftime('%Y-%m-%d')}
         for n in Node.objects.filter(name__contains=text)],
        safe=False)


def node(request):
    return render(request, 'forest.html')
