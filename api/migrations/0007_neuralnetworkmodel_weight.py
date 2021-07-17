# Generated by Django 3.2.4 on 2021-07-12 13:26

import api.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20210711_1222'),
    ]

    operations = [
        migrations.AddField(
            model_name='neuralnetworkmodel',
            name='weight',
            field=models.FileField(default='none', upload_to=api.models.model_directory_path, validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['bin'])]),
            preserve_default=False,
        ),
    ]