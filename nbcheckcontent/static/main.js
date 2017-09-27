define([
  'base/js/namespace',
], function(Jupyter) {
  'use strict';

  // Finds num of leading #'s in a given string'
  function get_heading_level (text) {
    // zero indexed, as levels are stored in an list
    return text.match(/^#*/)[0].length - 1;
  }

  // Replaces 'before' with 'after' given the last index of 'before'
  function replace_by_index(str, before, after, last_index) {
    var begin = last_index - before.length;
    var end = last_index;
    return str.substring(0, begin) + after + str.substring(end);
  }

  // Removes previous numbers from headings
  function strip_numbers(str) {
    return str.replace(/^[\d. ]+ (.*)/g, '$1');
  }

  // Generate heading numbers as a string
  function generate_number(level, counts) {
    var rs ='';
    for (var i = 0; i <= level; i++) {
      rs += counts[i] + '.';
    }
    return rs;
  }

  // track/update numbering thus far
  function update_numbering(heading_count, level){
    heading_count[level] += 1;
    for (var k = level + 1; k < 7; k++) {
      heading_count[k] = 0;
    }
  }

  // replace/add numbers to existing content
  function handle_content(text, heading_count, level, content, re) {
    var new_content = generate_number(level, heading_count) + ' ' + strip_numbers(content);
    return replace_by_index(text, content, new_content, re.lastIndex);
  }

  function number_cells() {
    var heading_count, cells, re, text, match, level, content;
    // list to track heading numbers
    heading_count = [];

    // headings can have a level up to 6
    for (var i = 0; i < 7; i++) {
      heading_count[i] = 0;
    }

    re = /^#* (.*)/gm;
    cells = Jupyter.notebook.get_cells();

    for (var j = 0; j < cells.length; j++) {
      text = cells[j].get_text();

      // ## Example Heading
      // match[0]: '##'
      // match[1]: 'Example Heading'
      match = re.exec(text);

      while (match) {
        level = get_heading_level(match[0]);
        if (level >= 6) {
          match = re.exec(text);
          continue;
        }
        content = match[1];

        update_numbering(heading_count, level);
        text = handle_content(text, heading_count, level, content, re);

        match = re.exec(text);
      }

      cells[j].set_text(text);
      cells[j].render();
    }
  }



  var load_extension = function() {
    Jupyter.toolbar.add_buttons_group([action]);
  };

  var action = {
    'label'   : 'Number Markdown Cells',
    'icon'    : 'fa fa-rocket',
    'callback': number_cells
  };

  var extension = {
    load_jupyter_extension : load_extension,
    load_ipython_extension : load_extension
  };
  return extension;
});
