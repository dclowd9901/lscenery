
<% /* BASIC LAYOUT */ %>

<% if (section === 'layout') { %>

  <fieldset class="${key}" id="${key}" data-groupings="${key}">
  <legend data-groupings="${key}">${key}</legend>
  ${inner}
  </fieldset>

<% } %>


<% /* TEXT */ %>

<% if (section === 'textInput') { %>

  <label class="${id}" for="${id}" data-groupings="${id}">${key}</label>
  <input type="text" class="${id}" id="${id}" data-groupings="${id}" name="${name}" value="${value}" />

<% } %>


<% /* SELECT */ %>

<% if (section === 'selectInput') { %>

  <label class="${id}" for="${id}" data-groupings="${id}">${key}</label>
  <select class="${id}" id="${id}" name="${name}" data-groupings="${id}">

  <% for (var i = 0; i < options.length; i++) { %>
    
    <option <%= ((i === selectedIndex) ? 'SELECTED' : '') %> value="${options[i]}">${desc[i]}</option>

  <% } %>

  </select>

<% } %>


<% /* RANGE */ %>

<% if (section === 'rangeInput') { %>

  <label class="${id}" for="${id}" data-groupings="${id}">${key}</label>
  <input class="${id}" type="range" id="${id}" name="${name}" min="${value.min}" max="${value.max}" step="${value.step}" value="${value.value}" data-groupings="${id}">

<% } %>      


<% /* RADIO */ %>

<% if (section === 'radioInput') { %>

  <fieldset class="${id}" id="${id}" data-groupings="${id}">
    <legend>${key}</legend>
    <ul>

      <% for (var i = 0; i < radios.length; i++) { %>
        
        <li>
          <label for="${id}-${i}">${radios[i]}</label>
          <input id="${id}-${i}" <%= i === selected ? 'CHECKED' : '' %> type="radio" name="${name}" value="${radios[i]}">
        </li>
      
      <% } %>
    
    </ul>
  </fieldset>
<% } %>


<% /* CHECKBOX */ %>

<% if (section === 'checkboxInput') { %>

  <fieldset class="${id}" id="${id}" data-groupings="${id}">
    <legend>${key}</legend>
    <ul>

      <% for (var i = 0; i < checkboxes.length; i++) { %>
        
        <li>
          <label for="${id}-${i}">${checkboxes[i]}</label>
          <input id="${id}-${i}" <%= selectedMap[i] ? 'CHECKED' : '' %> type="checkbox" name="${name}" value="${checkboxes[i]}">
        </li>
      
      <% } %>
    
    </ul>
  </fieldset>
<% } %>