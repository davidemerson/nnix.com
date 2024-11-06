+++
title = "Ulysses"
date = 2024-11-06
[taxonomies]
  readstate = ["read"]
  rating = ["5"]
  recommender = ["Peter F."]
  authorfirstname = ["James"]
  authorsurname = ["Joyce"]
  pubyear = ["1922"]
[extra]
  toc = true
+++

{% if page.taxonomies.authorfirstname %}
    <p>Author First Name: {{ page.taxonomies.authorfirstname[0].name }}</p>
{% endif %}

Author: {{ page.taxonomies.authorsurname[0] | default(value="") }}, {{ page.taxonomies.authorfirstname[0] | default(value="") }}
Publication Year: {{ page.taxonomies.pubyear[0] | default(value="") }}
# Rating: {{ page.taxonomies.rating[0] | default(value="") }}
# Recommended By: {{ page.taxonomies.recommender[0] | default(value="") }}
# Present State: {{ page.taxonomies.readstate[0] | default(value="") }}

# overview
I mean, it's the best book ever.

# why
Because you have to read the best book ever.

## and how
Good luck!