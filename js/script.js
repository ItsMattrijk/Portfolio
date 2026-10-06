// ==============================================================================
// PORTFOLIO · Matthieu Doolaeghe — script (js/script.js)
// Chargé en fin de <body> dans Index.html : <script src="js/script.js"></script>
//
// SOMMAIRE
//   01 · DONNÉES (à modifier pour mettre à jour le contenu)
//   02 · UTILITAIRES
//   03 · HEADER : horloge et menu mobile
//   04 · MODALE : ouverture / fermeture des pages détaillées
//   05 · TUILES DE L'ACCUEIL
//   06 · PAGE PROJETS
//   07 · PAGE COMPÉTENCES
//   08 · PAGE CV
//   09 · PAGE CONTACT
//   10 · PAGE GRAPHISME + VISIONNEUSE
//   11 · ÉVÉNEMENTS GLOBAUX
//
// REPÈRES UTILES
// - Les données (projets, créations...) sont tout en haut : on y ajoute des lignes.
// - Les pages détaillées sont des <template id="m-xxx"> dans Index.html ; openM()
//   copie le template de la tuile cliquée, puis appelle initXxx() pour le remplir.
// - Les éléments marqués data-k="..." / data-a="..." dans le HTML sont remplis par ce script.
// - Les chemins d'images (Assets/, Projet/) sont relatifs à Index.html, pas à ce fichier.
// ==============================================================================

// ===========================================================================
// 01 · DONNÉES (à modifier pour mettre à jour le contenu)
// Tout le contenu dynamique du site : projets, compétences, référentiel STI2D, créations
// graphiques... Pour ajouter un projet ou une création, on ajoute une ligne ici.
// ===========================================================================

// Bases des URLs : GH = profil GitHub (dépôts), PG = GitHub Pages (sites en ligne)
var GH='https://github.com/ItsMattrijk/',PG='https://itsmattrijk.github.io/';
// Couleur associée à chaque langage (pastilles et barres de répartition)
var LC={JavaScript:'#f1e05a',CSS:'#8a5bd6',HTML:'#e34c26',PHP:'#7a86c6',Dart:'#00b4ab','C++':'#f34b7d',CMake:'#da3434','C#':'#4ea72e'};
// Filtres de la page Projets : [clé, libellé du bouton]
var CATS=[['all','Tous'],['jeu','Jeux web'],['site','Sites web'],['app','Applications']];
// Libellé affiché pour chaque catégorie de projet
var CATL={jeu:'Jeu web',site:'Site web',app:'Application',autre:'Projet'};
// LISTE DES PROJETS : c'est ici qu'on ajoute / modifie un projet.
// n = nom · c = catégorie (jeu / site / app) · img = nom de l'image dans Projet/ (sans .png)
// d = description · t = technologies · b = répartition du code [[langage, %]]
// live = URL du site en ligne (optionnel) · repo = nom du dépôt GitHub (optionnel)
var PJ=[
{n:'PSGDLE',c:'jeu',img:'PSGDLE',d:"Jeu web quotidien sur le Paris Saint-Germain.",t:['JavaScript','CSS','HTML'],b:[['JavaScript',50.9],['CSS',34.3],['HTML',14.8]],live:PG+'PSGDLE/',repo:'PSGDLE'},
{n:'DragonBallDLE',c:'jeu',img:'DBDLE',d:"Jeu web quotidien sur l'univers Dragon Ball.",t:['JavaScript','CSS','HTML'],b:[['JavaScript',45.4],['CSS',41.8],['HTML',12.8]],live:PG+'DragonBallDLE/',repo:'DragonBallDLE'},
{n:'JojoDLE',c:'jeu',img:'JOJODLE',d:"Jeu web quotidien sur JoJo's Bizarre Adventure.",t:['JavaScript','CSS','HTML'],b:[['JavaScript',45.8],['CSS',30],['HTML',24.2]],live:PG+'JojoDLE/',repo:'JojoDLE'},
{n:'Stand-by',c:'site',img:'STANDBY',d:"Encyclopédie interactive des Stands de JoJo (Parties III–IX) avec recherche, filtres, comparaison et mode duel.",t:['JavaScript','CSS','HTML'],b:[['JavaScript',52.5],['CSS',42.4],['HTML',5.1]],live:PG+'Stand-by/',repo:'Stand-by'},
{n:'Treasure Bay',c:'site',img:'TREASUREBAY',d:"Marketplace e-commerce en PHP inspirée de One Piece : produits thématiques, panier, commandes, authentification et panel admin.",t:['PHP','CSS','JavaScript'],b:[['PHP',56.9],['CSS',34.7],['JavaScript',8.4]],live:'https://treasurebay.gt.tc/',repo:'Treasure-Bay'},
{n:'World Economy News Paper',c:'site',img:'WENP',d:"Site de journal en ligne inspiré du célèbre journal Big News Morgans de One Piece.",t:['PHP','CSS'],b:[['PHP',75.9],['CSS',24.1]],live:'https://wenp.gt.tc/',repo:'World-Economy-Newspaper'},
{n:'Codeur-Décodeur',c:'site',img:'CODEURDECODEUR',d:"Site web permettant d'encoder et de décoder des messages facilement.",t:['HTML','CSS','JavaScript'],b:[['HTML',42.6],['CSS',38.5],['JavaScript',18.9]],live:PG+'Codeur-Decodeur/',repo:'Codeur-Decodeur'},
{n:'All-Blue',c:'app',img:'ALLBLUE',d:"Application mobile sur le thème de One Piece : une encyclopédie complète du monde de One Piece, avec carte et favoris.",t:['Flutter','Dart'],b:[['Dart',87.6],['C++',6.2],['CMake',5]],repo:'All-Blue'},
{n:'MangaReader',c:'app',img:'MANGAREADER',d:"Application Flutter de lecture de manga multi-sources : téléchargement hors-ligne, lecteur optimisé, historique, statistiques et thèmes.",t:['Flutter','Dart','Provider'],b:[['Dart',99.8]],repo:'MangaReader'},
{n:'Devilopedia',c:'app',img:'DEVILOPEDIA',d:"Application Windows Forms en C# pour rechercher et consulter les Fruits du Démon de l'univers One Piece.",t:['C#','Windows Forms'],b:[['C#',100]],repo:'Devilopedia'},
{n:'JojoBots',c:'app',img:'JOJOBOTS',d:"Collection de 7 bots Discord thématiques inspirés des Stands de JoJo's Bizarre Adventure, chacun avec ses fonctionnalités.",t:['JavaScript','Discord'],b:[['JavaScript',100]],repo:'JojoBots'}
];

// Compétences affichées dans la tuile Compétences : [groupe, [technos]]
var SK=[
['Front-end',['HTML / CSS','JavaScript','Angular']],
['Back-end',['PHP','Laravel','SQL']],
['Mobile & desktop',['Flutter','C#']]
];

// Référentiel Bac STI2D (spécialité SIN) : [code famille, intitulé, [[code, texte, 1 si spécifique SIN]]]
var STI=[
['C1','Caractériser des produits ou des constituants privilégiant un usage raisonné du point de vue développement durable',[
['C1.1','Justifier les choix des structures matérielles et/ou logicielles d’un produit, identifier les flux mis en œuvre dans une approche de développement durable'],
['C1.2','Justifier le choix d’une solution selon des contraintes d’ergonomie et de design'],
['C1.3','Justifier les solutions constructives d’un produit au regard des performances environnementales et estimer leur impact sur l’efficacité globale']]],
['C2','Identifier les éléments influents du développement d’un produit',[
['C2.1','Décoder le cahier des charges d’un produit, participer, si besoin, à sa modification'],
['C2.2','Évaluer la compétitivité d’un produit d’un point de vue technique et économique']]],
['C3','Analyser l’organisation fonctionnelle et structurelle d’un produit',[
['C3.1','Identifier et caractériser les fonctions et les constituants d’un produit ainsi que ses entrées/sorties'],
['C3.2','Identifier et caractériser l’agencement matériel et/ou logiciel d’un produit'],
['C3.3','Identifier et caractériser le fonctionnement temporel d’un produit ou d’un processus'],
['C3.4','Identifier et caractériser des solutions techniques']]],
['C4','Communiquer une idée, un principe ou une solution technique, un projet, y compris en langue étrangère',[
['C4.1','Décrire une idée, un principe, une solution, un projet en utilisant des outils de représentation adaptés'],
['C4.2','Décrire le fonctionnement et/ou l’exploitation d’un produit en utilisant l’outil de description le plus pertinent'],
['C4.3','Présenter de manière argumentée des démarches, des résultats, y compris dans une langue étrangère']]],
['C5','Imaginer une solution, répondre à un besoin',[
['C5.1','S’impliquer dans une démarche de projet menée en groupe'],
['C5.2','Identifier et justifier un problème technique à partir de l’analyse globale d’un produit (approche matière – énergie – information)'],
['C5.3','Mettre en évidence les constituants d’un produit à partir des diagrammes pertinents'],
['C5.4','Planifier un projet (diagramme de Gantt, chemin critique) en utilisant les outils adaptés et en prenant en compte les données technico-économiques'],
['C5.5','Proposer des solutions à un problème technique identifié en participant à des démarches de créativité, choisir et justifier la solution retenue'],
['C5.6','Participer à une étude de design d’un produit dans une démarche de développement durable'],
['C5.7','Définir la structure matérielle, la constitution d’un produit en fonction des caractéristiques technico-économiques et environnementales attendues'],
['C5.8','Concevoir'],
['C5.8-SIN1','Proposer/choisir l’architecture d’une solution logicielle et matérielle au regard de la définition d’un produit',1],
['C5.8-SIN2','Rechercher et écrire l’algorithme de fonctionnement puis programmer la réponse logicielle relative au traitement d’une problématique posée',1]]],
['C6','Préparer une simulation et exploiter les résultats pour prédire un fonctionnement, valider une performance ou une solution',[
['C6.1','Expliquer des éléments d’une modélisation multi-physique proposée relative au comportement de tout ou partie d’un produit'],
['C6.2','Identifier et régler des variables et des paramètres internes et externes utiles à une simulation mobilisant une modélisation multi-physique'],
['C6.3','Évaluer un écart entre le comportement du réel et les résultats fournis par le modèle en fonction des paramètres proposés, conclure sur la validité du modèle'],
['C6.4','Choisir pour une fonction donnée, un modèle de comportement à partir d’observations ou de mesures faites sur le produit'],
['C6.5','Interpréter les résultats d’une simulation et conclure sur la performance de la solution'],
['C6.5-SIN1','Simulation d’un comportement informationnel faisant intervenir un ou plusieurs constituants matériels et/ou traitements logiciels simples d’une chaîne d’information',1]]],
['C7','Expérimenter et réaliser des prototypes ou des maquettes',[
['C7.1','Réaliser et valider un prototype ou une maquette obtenus en réponse à tout ou partie du cahier des charges initial'],
['C7.2','Mettre en œuvre un scénario de validation devant intégrer un protocole d’essais, de mesures et/ou d’observations sur le prototype ou la maquette, interpréter les résultats et qualifier le produit'],
['C7.3','Expérimenter'],
['C7.3-SIN1','Des moyens matériels d’acquisition, de traitement, de stockage et de restitution de l’information pour aider à la conception d’une chaîne d’information',1],
['C7.3-SIN2','Des architectures matérielles et logicielles en réponse à une problématique posée',1]]]
];
// Couleurs et titres courts des 7 familles de compétences (C1 à C7), dans le même ordre que STI
var STIC=['#2fbf84','#5aa9ff','#a98bff','#f1b84a','#e5271f','#2fc4d6','#ff7a45'];
var STIS=["Développement durable", "Éléments influents", "Organisation du produit", "Communiquer", "Imaginer une solution", "Simulation", "Prototypes"];

// Page CV : technos regroupées pour compter les projets [libellé, [technos de PJ]]
var CVP=[['HTML / CSS',['HTML','CSS']],['JavaScript',['JavaScript']],['PHP',['PHP']],['Flutter',['Flutter']],['C#',['C#']]];
// Outils / technos complémentaires affichés dans le CV
var CVPLUS=['Laravel','Node.js','Angular','SQL / PostgreSQL','API REST','Docker','Python','Firebase','Git','Arduino'];
// Soft skills affichées dans le CV
var CVSOFT=['Autonomie','Curiosité','Créativité','Résolution de problèmes','Adaptabilité','Investissement'];

// Dossier des images du graphisme
var GP='Assets/Graphisme/';
// LISTE DES CRÉATIONS GRAPHIQUES : f = fichier · t = titre · s = sous-titre
// c = catégorie (affiche / miniature) · r = ratio de l'image · fan:1 = fan art
var GW=[
{f:'ButeurAFFPSVFrance2026.webp',t:'Classement des buteurs',s:'Univers PSV · 2026',c:'affiche',r:'4/5'},
{f:'CALLUPSPSVFrance2026.webp',t:'International call-ups',s:'Univers PSV · 2026',c:'affiche',r:'4/5'},
{f:'ClassementPSGStats2026.webp',t:'Titis les mieux vendus',s:'PSG · Stats 2026',c:'affiche',r:'4/5'},
{f:'douexneymar2025.webp',t:'Doué × Neymar',s:'2025',c:'affiche',r:'9/16'},
{f:'REALPSV2026.webp',t:'Real – PSV',s:'Univers PSV · 2026',c:'affiche',r:'4/5'},
{f:'RBLPSV2026.webp',t:'RB Leipzig – PSV',s:'Univers PSV · 2026',c:'affiche',r:'4/5'},
{f:'TWENTEPSV2026.webp',t:'Twente – PSV',s:'Univers PSV · 2026',c:'affiche',r:'4/5'},
{f:'PSVHEE2026.webp',t:'PSV – Heerenveen',s:'Univers PSV · 2026',c:'affiche',r:'4/5'},
{f:'affichesdebut2024.webp',t:'Affiches de début',s:'2024',c:'affiche',r:'16/9'},
{f:'femimarsminiature2024.webp',t:'Miniature Femi',s:'Mars 2024',c:'miniature',fan:1,r:'16/9'},
{f:'squeezieminiature2024.webp',t:'Miniature Squeezie',s:'2024',c:'miniature',fan:1,r:'16/9'},
{f:'seinhor9miniature2021.webp',t:'Miniature Seinhor9',s:'2021',c:'miniature',r:'16/9'},
{f:'maisongriseminiature2021.webp',t:'Maison Grise',s:'2021',c:'miniature',fan:1,r:'16/9'}
];
// Filtres de la page Graphisme et libellés des catégories
var GCATS=[['all','Tous'],['affiche','Affiches'],['miniature','Miniatures']];
var GCATL={affiche:'Affiche',miniature:'Miniature'};

// ===========================================================================
// 02 · UTILITAIRES
// Petites fonctions réutilisées partout.
// ===========================================================================

// Raccourci de création d'élément : el('div','classe','texte') -> <div class="classe">texte</div>
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}

// ===========================================================================
// 03 · HEADER : horloge et menu mobile
// Horloge FM dans la barre du haut et bouton burger sur mobile.
// ===========================================================================

(function(){
  var d=document.getElementById('date'),t=document.getElementById('time');
  // Met à jour la date et l'heure affichées dans le header
  function tick(){
    var n=new Date();
    d.textContent=n.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});
    var j=n.toLocaleDateString('fr-FR',{weekday:'short'}).replace('.','');
    t.innerHTML=j.charAt(0).toUpperCase()+j.slice(1)+' <span>'+n.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</span>';
  }
  // Premier affichage immédiat, puis rafraîchissement toutes les 30 secondes
  tick();setInterval(tick,30000);
})();

var burger=document.querySelector('.burger'),nav=document.getElementById('nav');
// Ouvre / ferme le menu burger (mobile)
burger.addEventListener('click',function(){
  var s=nav.classList.toggle('show');burger.setAttribute('aria-expanded',s);
});
// Referme le menu quand on clique sur un lien
nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('show');burger.setAttribute('aria-expanded','false')}});

// ===========================================================================
// 04 · MODALE : ouverture / fermeture des pages détaillées
// Cliquer une tuile ouvre une page (modale) dont le contenu est copié depuis un <template>
// de Index.html. openM() choisit le template et lance l'init de la page.
// ===========================================================================

var modal=document.getElementById('modal'),last=null;

// Hauteur du header : la modale s'ouvre juste en dessous (variable CSS --hh)
var topbar=document.querySelector('.topbar');
function setHH(){modal.style.setProperty('--hh',topbar.getBoundingClientRect().bottom+'px')}
window.addEventListener('resize',function(){if(modal.classList.contains('open-m'))setHH()});

// Ouvre la modale d'une tuile : copie le <template id="m-<id de la tuile>"> de Index.html
// dans la modale, puis lance l'init de la page correspondante (initProjects, initComp...).
function openM(tile){
  last=document.activeElement;
  setHH();
  var title=tile.dataset.title,body=document.getElementById('m-body'),tpl=document.getElementById('m-'+tile.id);
  document.getElementById('m-title').textContent=title;
  body.innerHTML='';body.scrollTop=0;
  // Template trouvé -> on l'affiche et on initialise la page qui en a besoin
  if(tpl){body.appendChild(tpl.content.cloneNode(true));if(tile.id==='dev')initProjects(body);if(tile.id==='comp')initComp(body);if(tile.id==='contact')initContact(body);if(tile.id==='graph')initGraph(body);if(tile.id==='cv')initCV(body);if(tile.id==='foot')initStory(body)}
  // Pas de template -> page « à venir »
  else{var d=document.createElement('div');d.className='ph';d.innerHTML='<strong></strong>page détaillée à venir';d.firstChild.textContent=title;body.appendChild(d)}
  // Affiche la modale, bloque le scroll de la page derrière, focus sur le bouton fermer
  modal.classList.add('open-m');document.body.style.overflow='hidden';
  modal.querySelector('.close').focus();
  lastTile=tile;navActive(tile.id);
}
// Ferme la modale, rend le scroll et redonne le focus à l'élément qui l'avait ouverte
function closeM(){modal.classList.remove('open-m');document.body.style.overflow='';if(last)last.focus();navActive('top')}

// ===========================================================================
// 05 · TUILES DE L'ACCUEIL
// Carrousels (slides + pastilles + swipe) et remplissage des tuiles Projets / Compétences.
// ===========================================================================

document.querySelectorAll('.tile').forEach(function(tile){
  // Chaque tuile qui contient un .track devient un carrousel de slides
  var track=tile.querySelector('.track');
  if(!track)return;
  var slides=track.children,dots=tile.querySelector('.dots'),i=0;
  if(!dots||slides.length<2)return;
  // Création d'une pastille cliquable par slide
  var btns=[];
  for(var k=0;k<slides.length;k++){(function(k){
    var b=document.createElement('button');
    b.setAttribute('aria-label','Page '+(k+1)+' sur '+slides.length);
    b.addEventListener('click',function(){go(k)});
    dots.appendChild(b);btns.push(b);
  })(k)}
  // Affiche la slide n (bornée) : décale le .track et met à jour les pastilles
  function go(n){
    i=Math.max(0,Math.min(slides.length-1,n));
    track.style.transform='translateX('+(-100*i)+'%)';
    btns.forEach(function(b,k){b.setAttribute('aria-current',k===i)});
  }
  go(0);
  // Swipe tactile : un glissement horizontal de plus de 40px change de slide
  var x0=null;
  var vp=tile.querySelector('.viewport');
  vp.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  vp.addEventListener('touchend',function(e){
    if(x0===null)return;
    var dx=e.changedTouches[0].clientX-x0;
    if(Math.abs(dx)>40)go(i+(dx<0?1:-1));
    x0=null;
  });
});

// Calcule les statistiques à partir de PJ : nombre de projets, technos les plus utilisées,
// catégories et un projet « vedette » par catégorie.
function devStats(){
  var tc={},cats=[],feat=[];
  PJ.forEach(function(p){
    p.t.forEach(function(t){tc[t]=(tc[t]||0)+1});
    if(cats.indexOf(p.c)<0){cats.push(p.c);feat.push(p)}
  });
  var techs=Object.keys(tc).sort(function(a,b){return tc[b]-tc[a]});
  return {count:PJ.length,techs:techs,tc:tc,cats:cats,feat:feat};
}

// Tuile Projets : remplit les compteurs, la liste des projets phares et les barres de technologies.
function initDevTile(){
  var d=devStats(),q=function(k){return document.querySelector('[data-k="'+k+'"]')};
  q('dev-count').textContent=d.count;
  q('dev-tech').textContent=d.techs.length;
  q('dev-dom').textContent=d.cats.length;
  var ul=q('dev-list');
  d.feat.forEach(function(p){
    var li=el('li'),b=el('b','',p.n);
    li.appendChild(b);li.appendChild(el('span','',CATL[p.c]+' · '+p.t[0]));ul.appendChild(li);
  });
  var st=q('dev-stack'),mx=d.tc[d.techs[0]]||1;
  d.techs.slice(0,4).forEach(function(t){
    var n=d.tc[t],li=el('li'),bar=el('div','bar'),fill=el('i'),sm=el('small');
    li.style.setProperty('--c',LC[t]||'#5aa9ff');
    fill.style.setProperty('--w',Math.round(n/mx*100)+'%');bar.appendChild(fill);
    sm.appendChild(el('em','',n));sm.appendChild(document.createTextNode(n>1?'projets':'projet'));
    li.appendChild(el('b','',t));li.appendChild(bar);li.appendChild(sm);st.appendChild(li);
  });
}

// Tuile Compétences : crée un bloc par groupe de SK dans [data-k="comp-skills"]
function initSkillsTile(){
  var box=document.querySelector('[data-k="comp-skills"]');
  SK.forEach(function(g){
    var r=el('div','sr'),c=el('div','chips');
    r.appendChild(el('div','ft',g[0]));
    g[1].forEach(function(t){c.appendChild(el('span','chip',t))});
    r.appendChild(c);box.appendChild(r);
  });
}

// Remplissage des tuiles de l'accueil au chargement de la page
initDevTile();
initSkillsTile();

// ===========================================================================
// 06 · PAGE PROJETS
// Liste filtrable / triable + fiche détaillée (template m-dev).
// ===========================================================================

// PAGE PROJETS (modale) : liste filtrable / triable + fiche détaillée du projet sélectionné.
// root = contenu du template m-dev déjà inséré dans la modale.
function initProjects(root){
  var list=root.querySelector('.pj-list'),fb=root.querySelector('.pj-filters'),cnt=root.querySelector('.pj-count'),
      det=root.querySelector('.pj-det'),empty=root.querySelector('.pj-empty'),q=root.querySelector('.pj-search'),
      ths=root.querySelectorAll('.pj-th button'),body=document.getElementById('m-body');
  // État de la page : catégorie active, texte recherché, colonne de tri + sens, projet sélectionné
  var st={cat:'all',q:'',sort:null,dir:1,sel:0};
  var live=PJ.filter(function(p){return p.live}).length,techs=devStats().techs.length;
  root.querySelector('[data-k="pj-n"]').textContent=PJ.length;
  root.querySelector('[data-k="pj-t"]').textContent=techs;
  root.querySelector('[data-k="pj-l"]').textContent=live;
  // Langage principal d'un projet (premier de sa répartition de code)
  function main(p){return p.b&&p.b[0]?p.b[0]:[p.t[0]||'',0]}
  // Statut affiché : « En ligne » / « Code » / « À venir »
  function status(p){return p.live?['En ligne','on']:p.repo?['Code','code']:['À venir','']}
  // Initiales du projet pour l'icône de la liste
  function ini(n){return n.replace(/[^A-Za-zÀ-ÿ0-9 \-]/g,'').split(/[ \-]+/).filter(Boolean).slice(0,2).map(function(w){return w[0]}).join('').toUpperCase()}
  // Construction d'une ligne par projet : icône, nom, type, mini-barre des langages, langage principal, statut
  var rows=[];
  PJ.forEach(function(p,i){
    var li=el('li'),b=el('button','pj-row');b.type='button';b.setAttribute('role','option');b.dataset.i=i;
    b.appendChild(el('span','pj-ico',ini(p.n)));
    b.appendChild(el('span','pj-nm',p.n));
    b.appendChild(el('span','pj-ty',CATL[p.c]));
    var mini=el('span','pj-mini');
    (p.b||[]).forEach(function(x){var s=el('i');s.style.flex=x[1];s.style.background=LC[x[0]]||'#667';mini.appendChild(s)});
    b.appendChild(mini);
    var m=main(p),mt=el('span','pj-main-t'),dot=el('i');dot.style.background=LC[m[0]]||'#5aa9ff';
    mt.appendChild(dot);mt.appendChild(document.createTextNode(m[0]));b.appendChild(mt);
    var s=status(p),sp=el('span','pj-st'+(s[1]?' '+s[1]:''),s[0]);b.appendChild(sp);
    li.appendChild(b);list.appendChild(li);rows.push(li);
    b.addEventListener('click',function(){select(i,true)});
    b.addEventListener('keydown',function(e){
      if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
      e.preventDefault();var vis=visible(),k=vis.indexOf(i)+(e.key==='ArrowDown'?1:-1);
      if(k>=0&&k<vis.length){select(vis[k],false);rows[vis[k]].firstChild.focus()}
    });
  });
  // Indices des projets actuellement visibles (non masqués par le filtre)
  function visible(){
    var v=[];PJ.forEach(function(p,i){if(!rows[i].hidden)v.push(i)});return v;
  }
  // Affiche la fiche détaillée du projet i : bannière, répartition du code, technologies, liens
  function renderDet(i){
    var p=PJ[i];det.textContent='';
    var ban=el('div','pj-ban');ban.appendChild(el('span','',p.n));
    var im=new Image();im.alt='Bannière du projet '+p.n;im.src='Projet/'+p.img+'.png';
    im.addEventListener('error',function(){im.remove()});ban.appendChild(im);
    ban.appendChild(el('div','pj-dk',CATL[p.c]));
    var nav=el('div','pj-nav'),pv=el('button','','◀'),nx=el('button','','▶');
    pv.type=nx.type='button';pv.setAttribute('aria-label','Projet précédent');nx.setAttribute('aria-label','Projet suivant');
    pv.addEventListener('click',function(){step(-1)});nx.addEventListener('click',function(){step(1)});
    nav.appendChild(pv);nav.appendChild(nx);ban.appendChild(nav);det.appendChild(ban);
    var pl=el('div','pl');(p.b||[]).forEach(function(x){var s=el('i');s.style.flex=x[1];s.style.background=LC[x[0]]||'#667';s.title=x[0]+' '+x[1]+'%';pl.appendChild(s)});
    if(p.b)det.appendChild(pl);
    var bd=el('div','pj-db');bd.appendChild(el('h4','',p.n));bd.appendChild(el('p','',p.d));
    if(p.b){
      var sec=el('div','pj-sec');sec.appendChild(el('h5','','Répartition du code'));
      var ul=el('ul','pj-at');
      p.b.forEach(function(x){
        var li=el('li'),bar=el('div','bar'),f=el('i');
        li.style.setProperty('--c',LC[x[0]]||'#5aa9ff');
        f.style.width=Math.max(x[1],2)+'%';bar.appendChild(f);
        li.appendChild(el('span','',x[0]));li.appendChild(bar);li.appendChild(el('b','',Math.round(x[1])));
        ul.appendChild(li);
      });
      sec.appendChild(ul);bd.appendChild(sec);
    }
    if(p.t.length){
      var s2=el('div','pj-sec');s2.appendChild(el('h5','','Technologies'));
      var tg=el('div','pj-tgs');
      p.t.forEach(function(t){var e=el('span','tg'),d=el('i');d.style.background=LC[t]||'#5aa9ff';e.appendChild(d);e.appendChild(document.createTextNode(t));tg.appendChild(e)});
      s2.appendChild(tg);bd.appendChild(s2);
    }
    var ac=el('div','pj-ac');
    if(p.live){var l=el('a','live','Voir le site ↗');l.href=p.live;l.target='_blank';l.rel='noopener';ac.appendChild(l)}
    if(p.repo){var g=el('a','','Code GitHub');g.href=GH+p.repo;g.target='_blank';g.rel='noopener';ac.appendChild(g)}
    if(!p.live&&!p.repo)ac.appendChild(el('span','soon','Infos à venir'));
    bd.appendChild(ac);det.appendChild(bd);
  }
  // Sélectionne un projet : surligne sa ligne et affiche sa fiche
  function select(i,scroll){
    st.sel=i;
    rows.forEach(function(li,k){li.firstChild.setAttribute('aria-selected',k===i)});
    renderDet(i);
    if(scroll&&matchMedia('(max-width:900px)').matches)body.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  }
  // Projet précédent / suivant (d = -1 ou +1) parmi les projets visibles
  function step(d){
    var v=visible();if(!v.length)return;
    var k=v.indexOf(st.sel);k=(k+d+v.length)%v.length;select(v[k],false);
  }
  // Applique le filtre de catégorie + la recherche texte, met à jour le compteur
  function apply(){
    var n=0,needle=st.q.trim().toLowerCase();
    PJ.forEach(function(p,i){
      var ok=(st.cat==='all'||p.c===st.cat)&&(!needle||(p.n+' '+p.d+' '+p.t.join(' ')).toLowerCase().indexOf(needle)>-1);
      rows[i].hidden=!ok;if(ok)n++;
    });
    [].forEach.call(fb.children,function(b){b.setAttribute('aria-pressed',b.dataset.c===st.cat)});
    cnt.textContent=n+(n>1?' projets':' projet');
    empty.hidden=n>0;
    var v=visible();if(v.length&&v.indexOf(st.sel)<0)select(v[0],false);
  }
  // Trie la liste selon la colonne cliquée (un 2e clic inverse l'ordre)
  function sortRows(){
    var key=st.sort;
    var idx=PJ.map(function(p,i){return i});
    if(key){
      var val=function(i){var p=PJ[i];
        if(key==='n')return p.n.toLowerCase();
        if(key==='c')return CATL[p.c];
        if(key==='b')return p.b?p.b.length:0;
        if(key==='m')return main(p)[0].toLowerCase();
        if(key==='l')return p.live?0:p.repo?1:2};
      idx.sort(function(a,b){var x=val(a),y=val(b);return (x<y?-1:x>y?1:a-b)*st.dir});
    }
    idx.forEach(function(i){list.appendChild(rows[i])});
    [].forEach.call(ths,function(t){t.removeAttribute('aria-sort');if(t.dataset.s===key)t.setAttribute('aria-sort',st.dir>0?'ascending':'descending')});
  }
  [].forEach.call(ths,function(t){t.addEventListener('click',function(){
    if(st.sort===t.dataset.s){st.dir=-st.dir}else{st.sort=t.dataset.s;st.dir=1}
    sortRows();
  })});
  // Recherche en direct
  q.addEventListener('input',function(){st.q=q.value;apply()});
  // Boutons de filtre par catégorie, avec le nombre de projets
  CATS.forEach(function(c){
    var n=c[0]==='all'?PJ.length:PJ.filter(function(p){return p.c===c[0]}).length;
    var b=el('button','',c[1]+' · '+n);b.type='button';b.dataset.c=c[0];
    b.addEventListener('click',function(){st.cat=c[0];apply()});fb.appendChild(b);
  });
  // Premier affichage : tous les projets, le premier est sélectionné
  apply();select(0,false);
}

// ===========================================================================
// 07 · PAGE COMPÉTENCES
// Onglets BTS / STI2D et sous-navigation (template m-comp).
// ===========================================================================

// Onglet « Bac STI2D » de la page Compétences : menu des 7 familles (C1 à C7) + détail de la famille choisie.
// Construit une seule fois, au premier clic sur l'onglet.
function initSti(root){
  var wrap=root.querySelector('.sti');if(!wrap||wrap.children.length)return;
  // Colonne de gauche : un bouton par famille ; panneau de droite : sous-compétences
  var menu=el('ul','sti-menu'),pan=el('div','sti-pan'),btns=[],cur=0;
  wrap.appendChild(menu);wrap.appendChild(pan);
  STI.forEach(function(f,i){
    var li=el('li'),b=el('button');b.type='button';b.style.setProperty('--c',STIC[i%STIC.length]);
    b.appendChild(el('i','',f[0]));b.appendChild(el('span','',STIS[i]));
    b.addEventListener('click',function(){show(i)});li.appendChild(b);menu.appendChild(li);btns.push(b);
  });
  // Affiche la famille i dans le panneau (titre, navigation ◀ ▶, liste des sous-compétences)
  function show(i){
    cur=i;var f=STI[i],c=STIC[i%STIC.length];
    btns.forEach(function(b,k){b.setAttribute('aria-current',k===i)});
    pan.textContent='';pan.style.setProperty('--c',c);
    var h=el('div','bc-h');h.style.setProperty('--c',c);h.appendChild(el('i','',f[0]));
    var t=el('div');t.appendChild(el('b','',f[1]));t.appendChild(el('small','',f[2].length+(f[2].length>1?' sous-compétences':' sous-compétence')));h.appendChild(t);
    var nav=el('div','sti-nav'),pv=el('button','','◀'),nx=el('button','','▶');
    pv.type=nx.type='button';pv.setAttribute('aria-label','Famille précédente');nx.setAttribute('aria-label','Famille suivante');
    pv.addEventListener('click',function(){show((cur+STI.length-1)%STI.length)});
    nx.addEventListener('click',function(){show((cur+1)%STI.length)});
    nav.appendChild(el('small','',(i+1)+' / '+STI.length));nav.appendChild(pv);nav.appendChild(nx);h.appendChild(nav);
    pan.appendChild(h);
    var ul=el('ul','bl2');ul.style.setProperty('--c',c);
    f[2].forEach(function(r){
      var li=el('li',r[2]?'sub':'');
      li.appendChild(el('code','',r[0].replace(/^C\d\.\d-/,'')));li.appendChild(el('span','',r[1]));ul.appendChild(li);
    });
    pan.appendChild(ul);
  }
  show(0);
}

// Onglets BTS / Bac STI2D : affiche le bon panneau (le STI2D est construit à la demande)
function initDiplomes(root){
  var tabs=root.querySelectorAll('.dp-tabs button');
  [].forEach.call(tabs,function(b){b.addEventListener('click',function(){
    [].forEach.call(tabs,function(x){x.setAttribute('aria-pressed',x===b)});
    root.querySelector('#dp-bts').hidden=b.dataset.d!=='bts';
    var st=root.querySelector('#dp-sti');st.hidden=b.dataset.d!=='sti';
    if(b.dataset.d==='sti')initSti(root);
  })});
}

// PAGE COMPÉTENCES : onglets de diplômes + sous-navigation qui fait défiler vers une section
function initComp(root){
  initDiplomes(root);
  // Sous-navigation : un clic fait défiler la modale jusqu'à la section visée (data-go)
  var btns=root.querySelectorAll('.subnav button'),body=document.getElementById('m-body');
  [].forEach.call(btns,function(b){b.addEventListener('click',function(){
    [].forEach.call(btns,function(x){x.setAttribute('aria-current',x===b)});
    var t=root.querySelector('#'+b.dataset.go);
    if(t)body.scrollTo({top:body.scrollTop+t.getBoundingClientRect().top-body.getBoundingClientRect().top-12,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  })});
}

// ===========================================================================
// 08 · PAGE CV
// Onglets, statistiques et zoom du CV (template m-cv).
// ===========================================================================

// PAGE CV : onglets, statistiques de projets, listes, sélection croisée et zoom du CV.
function initCV(root){
  // Onglets : affiche le panneau dont l'id correspond à data-t
  var tabs=root.querySelectorAll('.cv-tabs button'),pans=root.querySelectorAll('.cv-pan');
  [].forEach.call(tabs,function(b){b.addEventListener('click',function(){
    [].forEach.call(tabs,function(x){x.setAttribute('aria-current',x===b)});
    [].forEach.call(pans,function(p){p.hidden=p.id!==b.dataset.t});
    document.getElementById('m-body').scrollTop=0;
  })});
  // Nombre de projets par technologie (barres), triées par ordre décroissant
  var cnt=CVP.map(function(x){return [x[0],PJ.filter(function(p){return p.t.some(function(t){return x[1].indexOf(t)>-1})}).length]}).sort(function(a,b){return b[1]-a[1]}),mx=cnt[0][1]||1;
  // Compteurs globaux : nombre de projets et de technologies
  var ds=devStats();root.querySelector('[data-k="cv-count"]').textContent=ds.count;root.querySelector('[data-k="cv-tech"]').textContent=ds.techs.length;
  var pb=root.querySelector('[data-a="proj"]');
  cnt.forEach(function(c){
    var r=el('div','cv-b'),top=el('div'),bar=el('i');
    top.appendChild(el('span','',c[0]));top.appendChild(el('small','',c[1]+(c[1]>1?' projets':' projet')));
    bar.style.setProperty('--w',Math.round(c[1]/mx*100)+'%');
    r.appendChild(top);r.appendChild(bar);pb.appendChild(r);
  });
  // Remplit les listes « outils » et « soft skills »
  [['plus',CVPLUS],['soft',CVSOFT]].forEach(function(g){
    var ul=root.querySelector('[data-a="'+g[0]+'"]');
    g[1].forEach(function(t){ul.appendChild(el('li','',t))});
  });
  // Éléments liés par data-p : survol ou clic sur l'un surligne son équivalent
  var rs=root.querySelectorAll('[data-p]');
  function sel(p){[].forEach.call(rs,function(x){
    var on=x.dataset.p===p;
    if(x.tagName==='BUTTON')x.setAttribute('aria-current',on);else x.classList.toggle('on',on);
  })}
  [].forEach.call(rs,function(x){
    x.addEventListener('click',function(){sel(x.dataset.p)});
    x.addEventListener('mouseenter',function(){sel(x.dataset.p)});
  });
  sel('0');
  // Onglet « document » : zoom du CV (− / + / Ajuster) et message si l'image est introuvable
  var im=root.querySelector('#cv-img'),z=1;
  function zs(n){z=Math.max(.5,Math.min(2.5,n));im.style.width=z===1?'':Math.round(880*z)+'px'}
  [].forEach.call(root.querySelectorAll('[data-z]'),function(b){b.addEventListener('click',function(){
    var d=b.dataset.z;zs(d==='+'?z+.25:d==='-'?z-.25:1);
  })});
  im.addEventListener('error',function(){im.hidden=true;root.querySelector('.cv-miss').hidden=false});
}

// ===========================================================================
// 09 · PAGE CONTACT
// Boutons « Copier » et formulaire mailto (template m-contact).
// ===========================================================================

// PAGE CONTACT : boutons « Copier » + formulaire (ouvre l'application mail via mailto:).
function initContact(root){
  // Boutons « Copier » : copie la valeur data-copy dans le presse-papiers (avec solution de repli)
  [].forEach.call(root.querySelectorAll('.cp-btn'),function(b){
    b.addEventListener('click',function(){
      var v=b.dataset.copy;
      function ok(){b.textContent='Copié';b.setAttribute('data-ok','true');setTimeout(function(){b.textContent='Copier';b.removeAttribute('data-ok')},1800)}
      function fb(){var t=document.createElement('textarea');t.value=v;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){}document.body.removeChild(t)}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(ok,fb)}else fb();
    });
  });
  // Formulaire : validation simple, puis ouverture du client mail avec le message pré-rempli
  var f=root.querySelector('#ct-form'),note=root.querySelector('#ct-note');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var nom=f.nom.value.trim(),mail=f.mail.value.trim(),msg=f.msg.value.trim();
    if(!nom||!/^\S+@\S+\.\S+$/.test(mail)||!msg){
      note.textContent='Renseigne ton nom, un email valide et ton message avant d’envoyer.';
      note.style.color='#ff8a84';
      (!nom?f.nom:!/^\S+@\S+\.\S+$/.test(mail)?f.mail:f.msg).focus();
      return;
    }
    note.style.color='';
    var body=msg+'\n\n— '+nom+' ('+mail+')';
    location.href='mailto:matthieudoolaeghe21@gmail.com?subject='+encodeURIComponent('[Portfolio] '+f.sujet.value)+'&body='+encodeURIComponent(body);
    note.textContent='Ton application de messagerie s’ouvre. Si rien ne se passe, écris-moi directement à l’adresse ci-contre.';
  });
}

// ===========================================================================
// 10 · PAGE GRAPHISME + VISIONNEUSE
// Miniatures filtrables (template m-graph) et visionneuse plein écran (#lb).
// ===========================================================================

// État de la visionneuse : lb = élément, lbList = créations de la liste, lbPos = position,
// lbLast = élément à re-focaliser à la fermeture
var lb=document.getElementById('lb'),lbList=[],lbPos=0,lbLast=null,lbSrc=GW;
// Affiche la création p (boucle aux extrémités) : titre, compteur, légende, image, miniature active
function lbShow(p){
  lbPos=(p+lbList.length)%lbList.length;
  var w=lbSrc[lbList[lbPos]];
  document.getElementById('lb-t').textContent=w.t;
  document.getElementById('lb-n').textContent=(lbPos+1)+' / '+lbList.length;
  document.getElementById('lb-s').textContent=(GCATL[w.c]||w.c)+' · '+w.s+(w.fan?' · Fan art':'');
  var im=document.getElementById('lb-i');im.src=(w.p||GP)+w.f;im.alt=w.t+' ('+w.s+')';
  [].forEach.call(document.getElementById('lb-l').children,function(li,k){li.firstChild.setAttribute('aria-current',k===lbPos)});
  var cur=document.getElementById('lb-l').children[lbPos];
  if(cur&&cur.scrollIntoView)cur.scrollIntoView({block:'nearest'});
}
// Ouvre la visionneuse sur la liste d'indices de GW, à la position pos
function lbOpen(list,pos,src){
  lbLast=document.activeElement;lbList=list;lbSrc=src||GW;
  var ul=document.getElementById('lb-l');ul.innerHTML='';
  list.forEach(function(gi,k){
    var w=lbSrc[gi],li=document.createElement('li'),b=document.createElement('button'),im=document.createElement('img'),sp=document.createElement('span');
    b.type='button';im.src=(w.p||GP)+w.f;im.alt='';im.loading='lazy';sp.textContent=w.t;
    b.appendChild(im);b.appendChild(sp);b.addEventListener('click',function(){lbShow(k)});
    li.appendChild(b);ul.appendChild(li);
  });
  lb.classList.add('on');lbShow(pos);
  lb.querySelector('.lb-x').focus();
}
// Ferme la visionneuse et redonne le focus
function lbClose(){lb.classList.remove('on');if(lbLast&&lbLast.focus)lbLast.focus()}
// Boutons fermer / précédent / suivant, et clic sur le fond pour fermer
lb.querySelector('.lb-x').addEventListener('click',lbClose);
lb.querySelector('.prev').addEventListener('click',function(){lbShow(lbPos-1)});
lb.querySelector('.next').addEventListener('click',function(){lbShow(lbPos+1)});
lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
// Clavier : Échap ferme, ← → naviguent (phase capture : prioritaire sur la modale)
window.addEventListener('keydown',function(e){
  if(!lb.classList.contains('on'))return;
  if(e.key==='Escape'){e.stopPropagation();lbClose()}
  else if(e.key==='ArrowLeft'){e.preventDefault();lbShow(lbPos-1)}
  else if(e.key==='ArrowRight'){e.preventDefault();lbShow(lbPos+1)}
},true);

// PAGE GRAPHISME : grande visionneuse + miniatures filtrables (affiches / miniatures).
function initGraph(root){
  var list=root.querySelector('#gx-list'),fb=root.querySelector('#gf'),cnt=root.querySelector('#gc'),
      stage=root.querySelector('#gx-stage'),img=root.querySelector('#gx-img'),bg=root.querySelector('#gx-bg'),
      tt=root.querySelector('#gx-t'),ts=root.querySelector('#gx-s'),tag=root.querySelector('#gx-tag'),tn=root.querySelector('#gx-n');
  // cat = filtre actif, cur = création affichée, thumbs = boutons miniatures
  var cat='all',cur=0,thumbs=[];
  var q=function(k){return root.querySelector('[data-k="'+k+'"]')};
  q('g-n').textContent=GW.length;
  q('g-a').textContent=GW.filter(function(w){return w.c==='affiche'}).length;
  q('g-m').textContent=GW.filter(function(w){return w.c==='miniature'}).length;
  q('g-c').textContent=root.querySelectorAll('.client').length;
  // Indices des créations visibles (non masquées par le filtre)
  function vis(){var v=[];GW.forEach(function(w,i){if(!thumbs[i].hidden)v.push(i)});return v}
  // Une miniature cliquable par création
  GW.forEach(function(w,gi){
    var b=document.createElement('button');b.type='button';b.className='gt'+(w.r==='16/9'?' wide':'');
    b.setAttribute('aria-label',w.t);b.title=w.t;
    var im=document.createElement('img');im.src=GP+w.f;im.alt='';im.loading='lazy';b.appendChild(im);
    if(w.fan){var f=document.createElement('i');f.textContent='Fan art';b.appendChild(f)}
    b.addEventListener('click',function(){show(gi)});
    list.appendChild(b);thumbs.push(b);
  });
  // Affiche la création gi dans la grande zone (image, titre, compteur) et marque sa miniature
  function show(gi){
    cur=gi;var w=GW[gi],v=vis();
    img.src=GP+w.f;img.alt=w.t+' ('+w.s+')';bg.style.backgroundImage='url("'+GP+w.f+'")';
    tt.textContent=w.t;ts.textContent=GCATL[w.c]+' · '+w.s;tag.hidden=!w.fan;
    tn.textContent=(v.indexOf(gi)+1)+' / '+v.length;
    thumbs.forEach(function(b,k){b.setAttribute('aria-current',k===gi)});
    var el2=thumbs[gi];if(el2&&el2.scrollIntoView)el2.scrollIntoView({block:'nearest'});
  }
  // Précédent / suivant parmi les créations visibles
  function step(d){var v=vis();if(!v.length)return;var k=(v.indexOf(cur)+d+v.length)%v.length;show(v[k])}
  // Flèches précédent / suivant posées sur la scène
  [['prev','‹','Création précédente',-1],['next','›','Création suivante',1]].forEach(function(n){
    var b=document.createElement('button');b.type='button';b.className='gx-nav '+n[0];b.textContent=n[1];b.setAttribute('aria-label',n[2]);
    b.addEventListener('click',function(){step(n[3])});
    stage.appendChild(b);
  });
  // Bouton zoom : ouvre la visionneuse plein écran
  root.querySelector('#gx-zoom').addEventListener('click',function(){var v=vis();lbOpen(v,v.indexOf(cur))});
  // Applique le filtre de catégorie et met à jour le compteur
  function apply(c){
    cat=c;var n=0;
    GW.forEach(function(w,i){var ok=c==='all'||w.c===c;thumbs[i].hidden=!ok;if(ok)n++});
    [].forEach.call(fb.children,function(b){b.setAttribute('aria-pressed',b.dataset.c===c)});
    cnt.textContent=n+(n>1?' créations':' création');
    var v=vis();if(v.length)show(v.indexOf(cur)<0?v[0]:cur);
  }
  // Boutons de filtre par catégorie, avec le nombre de créations
  GCATS.forEach(function(c){
    var n=c[0]==='all'?GW.length:GW.filter(function(w){return w.c===c[0]}).length;
    var b=document.createElement('button');b.type='button';b.dataset.c=c[0];b.textContent=c[1]+' · '+n;
    b.addEventListener('click',function(){apply(c[0])});fb.appendChild(b);
  });
  apply('all');
}

// ===========================================================================
// 10 bis · « MON HISTOIRE » (page Graphisme)
// Lecteur de chapitres façon boîte de réception FM : liste à gauche, chapitre à droite.
// Le texte est dans Index.html (template m-graph, section .hs). Les photos sont ici :
// pour en ajouter / déplacer une, on change simplement la ligne dans HW (ch = n° du chapitre,
// en partant de 0 : 0 débuts · 1 Legacy · 2 téléphone cassé · 3 PC · 4 concours · 5 Seinhor9 · 6 irrégulier · 7 sport).
// ===========================================================================
var HP='Assets/Graphisme/Histoire/';
// f = fichier · t = légende · s = sous-titre (visionneuse) · c = libellé · ch = chapitre · p = dossier (HP par défaut)
var HW=[
{f:'mobile/ma1erminiatureoupresque.webp',t:'Ma première miniature (ou presque)',s:'2019',c:'Mobile',ch:0},
{f:'mobile/1.webp',t:'Création mobile · 1',s:'2019',c:'Mobile',ch:0},
{f:'mobile/2.webp',t:'Création mobile · 2',s:'2019',c:'Mobile',ch:0},
{f:'mobile/3.webp',t:'Création mobile · 3',s:'2019',c:'Mobile',ch:0},
{f:'mobile/4.webp',t:'Création mobile · 4',s:'Legacy Of Graphics',c:'Communauté',ch:1},
{f:'mobile/5.webp',t:'Création mobile · 5',s:'Legacy Of Graphics',c:'Communauté',ch:1},
{f:'mobile/6.webp',t:'Création mobile · 6',s:'Legacy Of Graphics',c:'Communauté',ch:1},
{f:'mobile/7.webp',t:'Création mobile · 7',s:'Legacy Of Graphics',c:'Communauté',ch:1},
{f:'Premiereminiaurepc.webp',t:'Ma première miniature sur PC',s:'2021',c:'PC',ch:3},
{f:'Premierphotomontage.webp',t:'Premier photomontage',s:'2021',c:'PC',ch:3},
{f:'Deuxiemephotomontage.webp',t:'Deuxième photomontage',s:'2021',c:'PC',ch:3},
{f:'concours1.webp',t:'Concours · création 1',s:'2021',c:'Concours',ch:4},
{f:'concours2.webp',t:'Concours · création 2',s:'2021',c:'Concours',ch:4},
{f:'concours3.webp',t:'Concours · création 3',s:'2021',c:'Concours',ch:4},
{f:'AttirerSeinhor9.webp',t:'Le concept pour attirer Seinhor9',s:'2021',c:'Client',ch:5},
{f:'MiniapourSeinhor9.webp',t:'La miniature pour Seinhor9',s:'2021',c:'Client',ch:5},
{f:'douexneymar2025.webp',t:'Doué × Neymar',s:'2025',c:'Affiche',ch:6,p:GP},
{f:'REALPSV2026.webp',t:'Real – PSV',s:'Univers PSV · 2026',c:'Affiche',ch:7,p:GP},
{f:'RBLPSV2026.webp',t:'RB Leipzig – PSV',s:'Univers PSV · 2026',c:'Affiche',ch:7,p:GP},
{f:'TWENTEPSV2026.webp',t:'Twente – PSV',s:'Univers PSV · 2026',c:'Affiche',ch:7,p:GP},
{f:'PSVHEE2026.webp',t:'PSV – Heerenveen',s:'Univers PSV · 2026',c:'Affiche',ch:7,p:GP}
];
HW.forEach(function(w){if(!w.p)w.p=HP});

function initStory(root){
  var tabs=[].slice.call(root.querySelectorAll('.hs-it')),panes=[].slice.call(root.querySelectorAll('.hs-ch')),
      eras=[].slice.call(root.querySelectorAll('.hs-era')),num=root.querySelector('.hs-foot .n');
  if(!tabs.length)return;
  var cur=0;
  // Galerie de chaque chapitre : une vignette cliquable par photo (ouvre la visionneuse plein écran)
  panes.forEach(function(pn,ci){
    var g=pn.querySelector('.hs-gal'),idx=[];
    HW.forEach(function(w,i){if(w.ch===ci)idx.push(i)});
    if(!g)return;
    if(!idx.length){g.remove();return}
    idx.forEach(function(gi,k){
      var w=HW[gi],b=document.createElement('button'),im=document.createElement('img'),sp=document.createElement('span');
      b.type='button';b.className='hs-ph';b.setAttribute('aria-label','Agrandir : '+w.t);
      im.src=w.p+w.f;im.alt=w.t;im.loading='lazy';im.onerror=function(){b.remove();if(!g.children.length)g.remove()};
      sp.textContent=w.t;b.appendChild(im);b.appendChild(sp);
      b.addEventListener('click',function(){lbOpen(idx,k,HW)});
      g.appendChild(b);
    });
  });
  // Affiche le chapitre n : onglet, panneau, période en haut, compteur
  function show(n,user){
    cur=(n+tabs.length)%tabs.length;
    tabs.forEach(function(t,i){var on=i===cur;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;if(on)t.classList.add('seen')});
    panes.forEach(function(p,i){p.hidden=i!==cur});
    var e=tabs[cur].dataset.era;
    eras.forEach(function(b){b.setAttribute('aria-current',b.dataset.era===e)});
    num.textContent=(cur+1)+' / '+tabs.length;
    if(user){tabs[cur].scrollIntoView({block:'nearest',inline:'nearest'});panes[cur].scrollIntoView({block:'nearest'})}
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){show(i,true)});
    // Clavier : flèches / début / fin pour passer d'un chapitre à l'autre
    t.addEventListener('keydown',function(e){
      var d=e.key==='ArrowDown'||e.key==='ArrowRight'?1:e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:0,n=null;
      if(d)n=cur+d;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;
      if(n===null)return;
      e.preventDefault();show(n,true);tabs[cur].focus();
    });
  });
  eras.forEach(function(b){b.addEventListener('click',function(){
    for(var i=0;i<tabs.length;i++)if(tabs[i].dataset.era===b.dataset.era){show(i,true);break}
  })});
  root.querySelector('.hs-pv').addEventListener('click',function(){show(cur-1,true)});
  root.querySelector('.hs-nx').addEventListener('click',function(){show(cur+1,true)});
  show(0,false);
}

// ===========================================================================
// 11 · ÉVÉNEMENTS GLOBAUX
// Branchement des clics : tuiles, boutons ↗, navigation du header, fermeture de la modale, Échap.
// Placé en dernier : tout le DOM et toutes les fonctions existent déjà.
// ===========================================================================

// Tuile CV : le bouton d'aperçu ouvre la page CV directement sur l'onglet « document »
document.querySelectorAll('.cvk .pv').forEach(function(b){b.addEventListener('click',function(){openM(b.closest('.tile'));var t=document.querySelector('#m-body .cv-tabs [data-t="cv-doc"]');if(t)t.click()})});
// Boutons ↗ (et zone cliquable de la tuile Graphisme) : ouvrent la modale de leur tuile
document.querySelectorAll('.open,.gb-hit').forEach(function(b){
  b.addEventListener('click',function(){openM(b.closest('.tile'))});
});
// Fermeture de la modale : bouton ✕, clic sur le logo, touche Échap
modal.querySelector('.close').addEventListener('click',closeM);
document.querySelectorAll('.brand').forEach(function(a){a.addEventListener('click',function(){if(modal.classList.contains('open-m'))closeM()})});
// Header : chaque bouton ouvre la page de sa tuile
document.querySelectorAll('.nav a').forEach(function(a){
  a.addEventListener('click',function(e){
    var dd=a.closest('.nav-dd');if(dd){dd.classList.add('closed');dd.addEventListener('mouseleave',function f(){dd.classList.remove('closed');dd.removeEventListener('mouseleave',f)})}
    if(a.getAttribute('href')==='#top'){e.preventDefault();if(modal.classList.contains('open-m'))closeM();window.scrollTo(0,0);return}
    var t=document.getElementById((a.getAttribute('href')||'').slice(1));
    if(t&&t.classList.contains('tile')){e.preventDefault();openM(t)}
  });
});
// Tuile footer : un clic ouvre la page « Mon histoire avec le graphisme »
(function(){var f=document.getElementById('foot');if(!f)return;
  f.addEventListener('click',function(e){
    if(e.target.closest('a'))return;
    if(window.getSelection&&String(window.getSelection()))return;
    openM(f);
  });
})();
// Toute la tuile est cliquable (sauf liens et boutons, dont les pastilles du carrousel)
// La zone vide autour des pastilles ouvre bien la tuile : seuls les boutons ronds sont exclus
document.querySelectorAll('.tile:not(.t-foot)').forEach(function(t){
  t.addEventListener('click',function(e){
    if(e.target.closest('a,button'))return;
    if(window.getSelection&&String(window.getSelection()))return;
    openM(t);
  });
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('open-m'))closeM()});


// ===========================================================================
// 26 · PARAMÈTRES
// Fenêtre #set (Index.html) : thème, accent, densité, horloge, animations,
// contraste, plein écran et raccourcis clavier. Réglages enregistrés dans localStorage.
// ===========================================================================
(function(){
  var ov=document.getElementById('set'),openB=document.getElementById('set-open');
  if(!ov||!openB)return;
  var KEY='pf-settings',root=document.documentElement,back=null;
  var D={skin:'fm27',theme:'bleu',accent:'#e5271f',density:'normal',clock:true,motion:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,contrast:false,keys:true};
  var S=Object.assign({},D);
  try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
  if(S.skin!=='fm24')S.skin='fm27';
  // Accent par défaut de chaque style (remplacé automatiquement quand on change de style, sauf accent choisi à la main)
  var ACC={fm27:'#e5271f',fm24:'#f5a524'};
  // Libellés des 3 thèmes selon le style
  var THL={fm27:['Bleu FM','Violet','Anthracite'],fm24:['FM24','Violet','Noir']};
  var TILES=['profil','dev','comp','exp','graph','cv','contact'];

  // Applique les réglages au site, synchronise les contrôles, puis les enregistre
  function apply(){
    root.dataset.skin=S.skin;root.dataset.theme=S.theme;root.dataset.density=S.density;
    var tb=ov.querySelectorAll('[data-set="theme"] button');
    for(var i=0;i<tb.length&&i<3;i++)tb[i].textContent=THL[S.skin][i];
    root.style.setProperty('--red',S.accent);
    root.classList.toggle('noclk',!S.clock);root.classList.toggle('nm',!S.motion);root.classList.toggle('hc',S.contrast);
    ov.querySelectorAll('[data-set]').forEach(function(c){
      var k=c.dataset.set;
      if(c.getAttribute('role')==='switch')c.setAttribute('aria-checked',String(!!S[k]));
      else c.querySelectorAll('[data-v]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v===String(S[k])))});
    });
    try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  }
  function tab(n){
    ov.querySelectorAll('[data-tab]').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.tab===n))});
    ov.querySelectorAll('[data-pan]').forEach(function(p){p.hidden=p.dataset.pan!==n});
  }
  function open(){back=document.activeElement;ov.hidden=false;ov.querySelector('[aria-selected="true"]').focus()}
  function close(){ov.hidden=true;if(back&&back.focus)back.focus()}

  openB.addEventListener('click',open);
  ov.addEventListener('click',function(e){
    var t=e.target;if(t===ov)return close();
    var b=t.closest('button,a');if(!b)return;
    var c=b.closest('[data-set]');
    if(b.hasAttribute('data-close'))close();
    else if(b.dataset.tab)tab(b.dataset.tab);
    else if(b.getAttribute('role')==='switch'){S[b.dataset.set]=!S[b.dataset.set];apply()}
    else if(c&&b.dataset.v){
      if(c.dataset.set==='skin'&&S.accent===ACC[S.skin])S.accent=ACC[b.dataset.v];
      S[c.dataset.set]=b.dataset.v;apply()
    }
    else if(b.dataset.act==='reset'){S=Object.assign({},D);apply()}
    else if(b.dataset.act==='fs'){
      try{document.fullscreenElement?document.exitFullscreen():root.requestFullscreen()}catch(err){}
    }
  });

  // Clavier : Échap ferme, Tab reste dans la fenêtre, S et 1-7 sont les raccourcis
  document.addEventListener('keydown',function(e){
    if(!ov.hidden){
      if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close();return}
      if(e.key==='Tab'){
        var f=[].filter.call(ov.querySelectorAll('button,a[href]'),function(x){return x.offsetParent});
        var a=f[0],z=f[f.length-1];
        if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
        else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
      }
    }
    if(!S.keys||e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
    var k=e.key.toLowerCase();
    if(k==='s'){ov.hidden?open():close();return}
    if(!ov.hidden)return;
    var i=parseInt(k,10);
    if(i>=1&&i<=TILES.length){var t=document.getElementById(TILES[i-1]);if(t&&typeof openM==='function')openM(t)}
  },true);

  apply();
})();

// ===========================================================================
// 27 · STYLE FM24 : menu latéral et barre du haut
// Le menu vertical (.nav) met en surbrillance la page ouverte, le champ titre
// (#fm-t / #fm-s) l'affiche, les flèches ‹ › ferment / rouvrent la page et le
// gros bouton violet ouvre Contact. Sans effet visuel en style FM27 (éléments masqués).
// ===========================================================================
var lastTile=null;
// Met à jour l'entrée active du menu, le champ titre et l'état des flèches
function navActive(id){
  var isOpen=modal.classList.contains('open-m');
  document.querySelectorAll('.nav a').forEach(function(a){
    if((a.getAttribute('href')||'').slice(1)===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  var T=document.getElementById('fm-t'),S=document.getElementById('fm-s'),tl=isOpen?document.getElementById(id):null;
  if(T&&S){
    if(tl){T.textContent=tl.dataset.title||'';S.textContent='Portfolio › Matthieu Doolaeghe'}
    else{T.textContent='Matthieu Doolaeghe';S.textContent='Développeur Web & Applicatif · Graphiste · Accueil'}
  }
  var b=document.getElementById('fm-back'),f=document.getElementById('fm-fwd');
  if(b)b.disabled=!isOpen;
  if(f)f.disabled=isOpen||!lastTile;
}
(function(){
  var b=document.getElementById('fm-back'),f=document.getElementById('fm-fwd'),c=document.getElementById('fm-cta');
  if(b)b.addEventListener('click',function(){if(modal.classList.contains('open-m'))closeM()});
  if(f)f.addEventListener('click',function(){if(lastTile&&!modal.classList.contains('open-m'))openM(lastTile)});
  if(c)c.addEventListener('click',function(){var t=document.getElementById('contact');if(t)openM(t)});
  navActive('top');
})();