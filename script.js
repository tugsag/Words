document.addEventListener("DOMContentLoaded", function(event){
    var str = document.getElementById("string").value;
    var char = charCounter(str);
    var word = wordCounter(str);
    window.document.getElementById("words").innerHTML = "Words: ".concat(word);
    window.document.getElementById("chars").innerHTML = "Characters: ".concat(char);
}, false);

document.getElementById("string").oninput = function(){
    var str = document.getElementById("string").value;
    var char = charCounter(str);
    var word = wordCounter(str);
    window.document.getElementById("words").innerHTML = "Words: ".concat(word);
    window.document.getElementById("chars").innerHTML = "Characters: ".concat(char);
}
            
function charCounter(str){
    var string = String(str);
    var char = string.length;
    return char;
}

function wordCounter(str){
    var string = String(str);
    var word = string.split(' ').length;
    return word;
}

function uniqueWords(str){
    var string = String(str);
    var words = string.split(' ');
    var arr = [];
    var uniquearr = [];
    for(var i = 0; i < words.length; i++){
        arr.push(words[i]);
    }
    var m = {};
    var uniquearr = [];
    
    for(var j = 0; j < arr.length; j++){
        var v = arr[j];
        if(!m[v]){
            uniquearr.push(v);
            m[v] = true;
        }
    }
    return uniquearr;
}

document.addEventListener("select", function(e){
    console.log(getSelectedText());
}, false);


function getSelectedText(){
    var text = "";
    text = document.getSelection().toString();
    return text;
}

//Button behaviors

document.getElementById("search").onclick = function(){
    if(getSelectedText() == ''){
        alert("You have nothing selected!")
    }
    else{
        var q = getSelectedText();
        window.open('http://google.com/search?q='+q);
    }
}   

document.getElementById("copy").onclick = function(){
    var copyText = document.getElementById("string");
    copyText.select();
    document.execCommand("copy");
}

/*document.getElementById('dictionary').onclick = function(){
    if(getSelectedText()==''){
        alert("You have nothing selected!");
    }
    else{
        var q = getSelectedText();
        q = q.trim();
        dictionary(q);
    }
}

document.getElementById('synonym').onclick = function(){
    if(getSelectedText() == ''){
        alert('You have nothing selected!');
    }
    else{
        var q = getSelectedText();
        q = q.trim();
        thesaurus(q);
    }
}*/

document.getElementById('scholar').onclick = function(){
    if(getSelectedText()==''){
        alert("You have nothing selected!");
    }
    else{
        var q = getSelectedText();
        q = q.trim();
        window.open('http://scholar.google.com/scholar?q=' + q);
    }
}

//Direct lookup button behaviors

document.getElementById('directDict').onclick = function(){
    var q = document.getElementById('directWord').value;
    console.log(q);
    if(q == ''){
        alert('Your entry is blank!');
    }
    else{
        dictionary(q);
    }
}

document.getElementById('directThes').onclick = function(){
    var q = document.getElementById('directWord').value;
    if(q == ''){
        alert('Your entry is blank!');
    }
    else{
        thesaurus(q);
    }
}

document.getElementById('directWiki').onclick = function(){
    var q = document.getElementById('directWord').value;
    if(q == ''){
        alert('Your entry is blank!');
    }
    else{
        wikiResults(q);
    }
}


//File reader functions

function readFile(){
    var file = document.getElementById('file').files[0];
    var r = new FileReader();
    r.onload = function(e){
        var t = e.target.result;   
        var c = charCounter(t);
        var w = wordCounter(t);
        var u = uniqueWords(t);
        document.getElementById('fileWords').innerHTML = 'WORDS: ' + w;
        document.getElementById('fileChars').innerHTML = 'CHARACTERS: ' + c;
        document.getElementById('fileUniques').innerHTML = 'UNIQUE WORDS: ' + u.length;
        
    }
    
    r.readAsText(file);
}

document.getElementById('file').addEventListener('change', function(e){
    readFile();
}, false);

//API functions

function dictionary(word){
    var lines = document.getElementById("definition");
    if(lines.hasChildNodes()){
        deleteLines(lines);
    }
    
    var request = new XMLHttpRequest();
    
    var url = 'https://googledictionaryapi.eu-gb.mybluemix.net/?define=';
    
    url = url.concat(word);
    request.open('GET', url, true);
    
    request.onload = function(){
        if(request.status >= 200 && request.status < 400){
            var data = JSON.parse(this.response);
            document.getElementById('word').innerHTML = word;
        
            for(var key in data[0].meaning){
                var parent = document.createElement('p');
                var node = document.createTextNode(key + ' - ' + data[0].meaning[key][0].definition);
                parent.appendChild(node);
                
                var gparent = document.getElementById('definition');
                gparent.appendChild(parent);
            }
        }
        else{
            document.getElementById('word').innerHTML = 'Not found. Try again.';
        }
    }
        
    request.send();
}

function thesaurus(word){
    var lines = document.getElementById("definition");
    if(lines.hasChildNodes()){
        deleteLines(lines);
    }
    
    var request = new XMLHttpRequest();
    
    var url = 'https://googledictionaryapi.eu-gb.mybluemix.net/?define=';
    
    url = url.concat(word);
    request.open('GET', url, true);
    
    request.onload = function(){
        
        if(request.status >= 200 && request.status < 400){
            var data = JSON.parse(this.response);
            document.getElementById('word').innerHTML = word;
            
            for(var key in data[0].meaning){
                if(data[0].meaning[key][0].synonyms !== undefined){
                    var para = document.createElement('p');
                    var node = document.createTextNode(key + ' - ' + data[0].meaning[key][0].synonyms);
                    para.appendChild(node);
                
                    var element = document.getElementById('definition');
                    element.appendChild(para);
                }
                else{
                    continue;
                }
            }
        }
        else{
            $('#word').html('Not found. Please try again');
        }
    }
    
    request.send();
}

function wikiResults(word){
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    var endpoint = 'https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=';
    
    endpoint = endpoint.concat(word);
    
    fetch(proxy + endpoint)
        .then(response => response.json())
        .then(result => {
            displayWikiResult(result);
    });
}

function wikiDirect(word) {
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    var endpoint = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=';
    
    endpoint = endpoint.concat(word);
    
    fetch(proxy + endpoint)
        .then(response => response.json())
        .then(result => {
            displayWiki(result);
    });
}

//Helper functions

function deleteLines(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

var wikiSearchWord = '';

function displayWiki(data){
    const displayTit = document.getElementById('wikititle');
    const displayCon = document.getElementById('wikicontent')
    displayTit.innerHTML = '';
    displayCon.innerHTML = '';

    var text = '';
    var title = '';
    var result = data.query.pages;
    for (var prop in result) {
        text = result[prop].extract;
        title = result[prop].title;
        break;
    }
    if (text == undefined) {
        text = 'Not found';
    }
    displayTit.innerHTML = title;
    displayCon.innerHTML = text;
}

function displayWikiResult(data){
    var disp = document.getElementById('wikicontent');
    var result = data.query.search;
    result.forEach(item => {
        var k = item.title;
        var j = item.snippet;      
        disp.insertAdjacentHTML('beforeend',
            "<div><h3 class='articleTit'>" + k + "</h3><span>" + j + "</span><br></div>");
    myFunc();
    });
}

function myFunc(){
    $('.articleTit').click(function(event){
        wikiDirect($(event.target).text());
    });
}

// NAV BUTTON FUNCTIONS

document.getElementById('textEntry').onclick = function(){
    var entry = document.getElementById('entryField');
    if(entry.style.display == 'none'){
        entry.style.display = 'block';
    }
    var button = document.getElementById('textEntry');
    button.classList.remove('defactive');
    var ancestor =  document.getElementById('navi');
    var children = ancestor.getElementsByTagName('*');
    
    for(var i = 0; i < children.length; i++){
        if(children[i].classList.contains('active')){
            children[i].classList.remove('active');
        }
    }
    button.classList.add('active');
    document.getElementById('directStuff').style.display = 'none';
    document.getElementById('fileStuff').style.display = 'none';
    document.getElementById('utilities').style.display = 'none';
    document.getElementById('wordSearch').style.display = 'none';
    
}

document.getElementById('lookup').onclick = function(){
    var look = document.getElementById('directStuff');
    if(look.style.display == 'none'){
        look.style.display = 'block';
    }
    var ancestor = document.getElementById('navi');
    var children = ancestor.getElementsByTagName('*');
    
    if(document.getElementById('textEntry').classList.contains('defactive')){
        document.getElementById('textEntry').classList.remove('defactive');
    }
    
    for(var i = 0; i < children.length; i++){
        if(children[i].classList.contains('active')){
            children[i].classList.remove('active');
        }
    }
    document.getElementById('lookup').classList.add('active');
    document.getElementById('entryField').style.display = 'none';
    document.getElementById('fileStuff').style.display = 'none';
    document.getElementById('utilities').style.display = 'none';
    document.getElementById('wordSearch').style.display = 'none';
}

document.getElementById('fileEntry').onclick = function(){
    var file = document.getElementById('fileStuff');
    if(file.style.display == 'none'){
        file.style.display = 'block';
    }
    if(document.getElementById('textEntry').classList.contains('defactive')){
        document.getElementById('textEntry').classList.remove('defactive');
    }
    
    
    var ancestor = document.getElementById('navi');
    var children = ancestor.getElementsByTagName('*');
    
    for(var i = 0; i < children.length; i++){
        if(children[i].classList.contains('active')){
            children[i].classList.remove('active');
        }
    }
    
    document.getElementById('fileEntry').classList.add('active');
    document.getElementById('entryField').style.display = 'none';
    document.getElementById('directStuff').style.display = 'none';
    document.getElementById('utilities').style.display = 'none';
    document.getElementById('wordSearch').style.display = 'none';
}

document.getElementById('utilityNav').onclick = function(){
    var util = document.getElementById('utilities');
    if(util.style.display == 'none'){
        util.style.display = 'block';
    }
    if(document.getElementById('textEntry').classList.contains('defactive')){
        document.getElementById('textEntry').classList.remove('defactive');
    }
    
    var ancestor = document.getElementById('navi');
    var children = ancestor.getElementsByTagName('*');
    
    for(var i = 0; i < children.length; i++){
        if(children[i].classList.contains('active')){
            children[i].classList.remove('active');
        }
    }
    
    document.getElementById('utilityNav').classList.add('active');
    document.getElementById('entryField').style.display = 'none';
    document.getElementById('fileStuff').style.display = 'none';
    document.getElementById('directStuff').style.display = 'none';
    document.getElementById('wordSearch').style.display = 'none';
}

document.getElementById('wordSearchNav').onclick = function(){
    var word = document.getElementById('wordSearch');
    if(word.style.display == 'none'){
        word.style.display = 'block';
    }
    if(document.getElementById('textEntry').classList.contains('defactive')){
        document.getElementById('textEntry').classList.remove('defactive');
    }
    
    var ancestor = document.getElementById('navi');
    var children = ancestor.getElementsByTagName('*');
    
    for(var i = 0; i < children.length; i++){
        if(children[i].classList.contains('active')){
            children[i].classList.remove('active');
        }
    }
    
    document.getElementById('wordSearchNav').classList.add('active');
    document.getElementById('utilities').style.display = 'none'
    document.getElementById('entryField').style.display = 'none';
    document.getElementById('fileStuff').style.display = 'none';
    document.getElementById('directStuff').style.display = 'none';
    
}

// UTILITIES FUNCTIONS 

document.getElementById('randomNumButton').onclick = function(){
    var num = document.getElementById('randomNumRange').value;
    if(num == ''){
        document.getElementById('randomDisp').innerHTML = 'Enter a number';
    }
    else{
        num = parseInt(num, 10);
        var random = Math.floor(Math.random() * (num+1));
        document.getElementById('randomDisp').innerHTML = random;
    }
}

var wordList = {};
document.addEventListener('DOMContentLoaded', function(e){
    $.get('https://cors-anywhere.herokuapp.com/http://www.mieliestronk.com/corncob_lowercase.txt', function(data){
        wordList = data.split('\n');
    })
});

document.getElementById('randomWordButton').onclick = function(){
    var numofWords = document.getElementById('randomWordRange').value;
    if (numofWords == '') {
        numofWords = '1';
    }
        var num = parseInt(numofWords, 10);
        var arr = [];
        for(var i = 0; i < num; i++){
            var random = Math.floor(Math.random() * wordList.length);
            arr.push(wordList[random]);
        }
        document.getElementById('randomWordDisp').innerHTML = arr;
    }




// WORD SEARCH FUNCTIONS



var startList = [];
var endList = [];
var includeList = [];

function linearSearchStart(arr, val){
    var newarr = [];
    var i = 0;
    while(arr[i].charCodeAt(0) <= val.charCodeAt(0)){
        if(arr[i][0] == val[0]){
            newarr.push(arr[i]);
        }
        i += 1
    }
    startList = newarr;
    endList = [];
    includeList = [];
}

function linearSearchEnd(arr, val){
    var newarr = [];
    for(var x in arr){
        if(arr[x].substr(-val.length -1).includes(val)){
            newarr.push(arr[x]);
        }
    }
    endList = newarr;
    startList = [];
    includeList = [];
}

function linearSearchInclude(arr, val){
    var newarr = [];
    for(var x in arr){
        if(arr[x].includes(val)){
            newarr.push(arr[x]);
        }
    }
    includeList = newarr;
    endList = [];
    startList = [];
}

$('#wordStartButton').click(function(){
    var start = $('#wordContain').val().toLowerCase();
    var finalarr = [];
    if(start == ''){
        $('#wordContainDisp').html('Enter start of word');
    }
    else{
        linearSearchStart(wordList, start);
        for(var x in startList){
            if(startList[x].startsWith(start)){
                finalarr.push(startList[x]);
            }
        }
        startList = finalarr;
        for(var y in finalarr){
            finalarr[y] = finalarr[y] + ' | \n';
        }
        if(finalarr.length == 0){
            $('#wordContainDisp').html('No words found');
        }
        else{
            $('#wordReturn').html('Words starting with ' + start);
            $('#wordContainDisp').html(finalarr);
            $('#honeButton').css('display', 'inline-block');
        }
    }
});


$('#wordEndButton').click(function(){
    var end = $('#wordContain').val().toLowerCase();
    
    if(end == ''){
        $('#wordContainDisp').html('Enter end of word');
    }
    else{
        linearSearchEnd(wordList, end);
        for(var x in endList){
            endList[x] = endList[x] + ' | \n';
        }
        if(endList.length == 0){
            $('#wordContainDisp').html('No words found');
        }
        else{
            $('#wordReturn').html('Words ending in ' + end);
            $('#wordContainDisp').html(endList);
            $('#honeButton').css('display', 'inline-block');
        }
    }
});


$('#wordIncludeButton').click(function(){
    var include = $('#wordContain').val().toLowerCase();
    if(include == ''){
        $('#wordContainDisp').html('Enter phrase to search');
    }
    else{
        linearSearchInclude(wordList, include);
        for(var x in includeList){
            includeList[x] = includeList[x] + ' | \n';
        }
        if(includeList.length == 0){
            $('#wordContainDisp').html('No words found');
        }
        else{
            $('#wordReturn').html('Words containing ' + include);
            $('#wordContainDisp').html(includeList);
            $('#honeButton').css('display', 'inline-block');
        }
    }
});

$('#honeButton').click(function(){
    var val = $('#wordContain').val().toLowerCase();
    if(startList.length > 0){
        linearSearchInclude(startList, val);
    }
    else if(endList.length > 0){
        linearSearchInclude(endList, val);
    }
    else{
        linearSearchInclude(includeList, val);
    }
    $('#honeReturn').html('Also containing ' + val);
    $('#honeDisp').html(includeList);
});

