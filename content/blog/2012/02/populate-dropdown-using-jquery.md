---
title: "Populating a Form with a dropdown (jQuery)"
date: '2012-02-05T18:39:03.284Z'
slug: '2012/02/populating-a-form-with-a-dropdown-jquery'
category: 'programming'
tags: ['javascript', 'programming', 'jquery']
keywords: ['dropdown', 'input', 'js']
---
I thought I’d share this, maybe it’ll help somebody else. Basically this will take the value of the drop down (select) and `show()` that many input fields.

## Javascript
```js
 $(document).ready(function(){
	    $("select[name=example]").change(function () {
	    $(".hidden_input").hide();
		var cnt = $("select[name=example]").val();  
			
			while(cnt > 0) {
				$(".hidden_input#"+cnt).show();
				cnt--;	
			}
			
	    });
	 
});
```
## HTML/CSS
```html
<style>
.hidden_input{
	display: none;
}
</style>
<form>
    <select name="example">
        <option value="1">1 Guests</option>
        <option value="2">2 Guests</option>
        <option value="3">3 Guests</option>
        <option value="4">4 Guests</option>
        <option value="5">5 Guests</option>
        <option value="6">6 Guests</option>
    </select>
</form>
<div id="1" class="hidden_input">1<input name="former" type="text"></div>
<div id="2" class="hidden_input">2<input name="former" type="text"></div>
<div id="3" class="hidden_input">3<input name="former" type="text"></div>
<div id="4" class="hidden_input">4<input name="former" type="text"></div>
<div id="5" class="hidden_input">5<input name="former" type="text"></div>
<div id="6" class="hidden_input">6<input name="former" type="text"></div>
```