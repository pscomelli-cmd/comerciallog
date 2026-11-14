"""Empaqueta dist/ en un único HTML (sin doctype ni <head>) para publicarlo como página independiente."""
import glob, sys
js = open(glob.glob('dist/assets/*.js')[0], encoding='utf8').read().replace('</script', '<\\/script')
css = open(glob.glob('dist/assets/*.css')[0], encoding='utf8').read()
open(sys.argv[1], 'w', encoding='utf8').write('<title>ComercialLog</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<style>' + css + '</style>\n<div id="root"></div>\n<script type="module">' + js + '</script>\n')
