import setuptools

setuptools.setup(
    name="nbcheckcontent",
    version='0.1.0',
    author="Jacky Lu",
    description="",
    packages= ["nbcheckcontent"],
    install_requires=[
        'notebook',
    ],
    package_data={'nbcheckcontent': ['static/*']},
)
