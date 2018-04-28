from django.db import models


class Comic(models.Model):
    name = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    created = models.DateTimeField('created')

    def __str__(self):
        return '{} {} {}'.format(self.name, self.filename, self.created)
