# Generated by Django 3.1.3 on 2020-11-18 13:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_auto_20201117_1841'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='post',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
