
<% /* BASIC LAYOUT */ %>

<% if (section === 'layout') { %>

  <fieldset id="${key}">
  <legend>${key}</legend>
  ${inner}
  </fieldset>

<% } %>


<% /* TEXT */ %>

<% if (section === 'textInput') { %>

  <label for="${id}">${key}</label>
  <input id="${id}" name="${name}" value="${value}" />

<% } %>


<% /* SELECT */ %>

<% if (section === 'selectInput') { %>

  <label for="${id}">${key}</label>
  <select id="${id}" name="${name}">

  <% for (var i = 0; i < options.length; i++) { %>
    
    <option <%= ((i === selectedIndex) ? 'SELECTED' : '') %> value="${options[i]}">${options[i]}</option>

  <% } %>

  </select>

<% } %>


<% /* RANGE */ %>

<% if (section === 'rangeInput') { %>

  <label for="${id}">${key}</label>
  <input type="range" id="${id}" name="${name}" min="${value.min}" max="${value.max}" step="${value.step}" value="${value.value}">

<% } %>      


<% /* RADIO */ %>

<% if (section === 'radioInput') { %>

  <fieldset id="${id}">
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

  <fieldset id="${id}">
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