# Generated by Django 3.2.7 on 2022-06-05 16:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('proofchecker', '0006_auto_20220605_1204'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssignmentDelay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('submission_date', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending', max_length=150)),
                ('assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proofchecker.assignment')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proofchecker.student')),
            ],
        ),
    ]
