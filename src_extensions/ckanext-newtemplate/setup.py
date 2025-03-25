# -*- coding: utf-8 -*-
from setuptools import setup

# Note: Do not add new arguments to setup(), instead add setuptools
# configuration options to setup.cfg, or any other project information
# to pyproject.toml
# See https://github.com/ckan/ckan/issues/8382 for details
setup(
    name='ckanext-newtemplate',
    version='0.1',
    packages=['ckanext.newtemplate'],
    entry_points={
        'ckan.plugins': [
            'newtemplate = ckanext.newtemplate.plugin:NewtemplatePlugin'
        ]
    }
)
