module.exports = {
  name: 'insult',
  description: 'Insult generator',
  cooldown: 0.5,
  guildOnly: true,
  args: true,
  usage: '<@User> <length 1 - 10>',
  execute(message, args) {
    const { prefix } = require('../bot_config.json');
    const checkMessageLength = require('../vitek_modules/checkMessageLength');
    const kurwoSkrypt = require('../vitek_modules/kurwoSkrypt');
    const getMention = require('../vitek_modules/getMention');

    if(!args[0] || !args[1]) return message.channel.send(`You must give all two arguments!\n\`${prefix}${this.name} ${this.usage}\``);

    let loops = parseInt(args[1]);

    if(isNaN(loops)) {
      return message.channel.send('You must give a number from 1 to 10!');
    }

    if(loops > 10) loops = 10;
    else if(loops < 1) loops = 1;
    console.log(loops);

    const member = getMention.member(args[0], message);
    if(!member) return message.channel.send('You must select one user that is on the server!');

    const c_words1 = ['krzywy', 'zjebany', 'zajebany', 'jebany', 'chujowy', 'popierdolony', 'obrzydliwy', 'wyjebany w kosmos', 'debilny', 'głupi', 'idiotyczny', 'śmieszny', 'diabelski', 'skurwysyński'];
    const c_words2 = ['diable tasmański', 'naplecie', 'cwelu', 'odbycie', 'chuju', 'kutasiarzu', 'złodzieju', 'penisie', 'cieciu', 'gnoju', 'debilu', 'idioto', 'bękarcie', 'fiucie', 'sukinkocie', 'matkojebco', 'pajacu'];
    const c_words3 = ['obszczany', 'obsrany', 'niedojebany', 'zesrany', 'zasrany', 'pisowski', 'w dupe kopany', 'w dupe jebany', 'śmierdzący', 'brzydko pachnący', 'walący gównem'];
    const c_words4 = ['śmieciu', 'klaunie', 'skurwielu', 'ścieku', 'leszczu', 'penerze', 'patałachu', 'nieudaczniku życiowy', 'judaszu', 'menelu', 'frajerze', 'biedaku', 'zjebie'];
    const c_words5 = ['fiuta se wsadź w imadło', 'idź klaskać jajami bo stary cię woła do ruchania', 'do twojej dupy można wlecieć helikopterem bojowym', 'twoja pizda jest jak czarna dziura wszystko pochłania', 'zwal mi konia stopami', 'wypierdalaj zlizywać bakterie z deski klozetowej', 'udław się sraką', 'wsadź sobie kutasa w mrowisko', 'wypierdalaj żreć kulki gówna z dupska swojego starego alkoholika', 'wsadź sobie palca w dupe', 'załaduj starego w dupala', 'załaduj starą w cipsko obsrane', 'zwal se konia papierem ściernym', 'idź tam wyliż jape ojcu', 'spadaj na drzewo', 'wypierdalaj stąd', 'spierdalaj na palmy kokosy zrywać', 'chuj ci na imie', 'jebiesz gównem', 'jebany golemie piaskowy', 'dałnie mały', 'krzywy kutasie', 'parobku', 'wypierdalaj na księżyc'];
    const c_words6 = ['twoja stara banany zrywa z krzaków', 'twoja stara ssie napleta', 'twój stary gryzie cię w pięty i ssie własnego napleta', 'twój stary głębokie gardło spija biegunkę z mojej dupy', 'twoja stara uwielbia mieć moje jajca w jej gardle', 'twoja stara uwielbiała rozmazywać sobie moje gówno na jej cycach owłosionych', 'twoja stara spełnia ze mną wszystkie fantazje', 'twoja stara spija szczyny prosto z mojego fiuta', 'twoja matka zamiata pustynie', 'twoja stara niedołężna jest jebana w dupe', 'pies cię spłodził pachołku', 'twojemu staremu śmierdzi z butów', 'twoja rodzina jebie skarpetami', 'wypierdalaj na drzewo banany zrywać', 'zesrałeś się bohomazie', 'obszczałeś gacie niewolniku w klatce', 'twoja matka małpa jebana ze starym gorylem'];
    const c_words7 = ['i chuj ci do dupy', 'i naplułbym ci w ryj i zajebał porządnego plaskuna', 'i twoja stara obrzezała sobie cipe', 'i mam nadzieję że będziesz srał na swoje dzieci tak jak twoja stara srała na ciebie tak jak ja przedtem srałem na nią', 'i sprawdź w pokoju u starego bo chyba cie wołał na jebanie', 'i twoja matka dawała sobie pchać kutasa w gardło i srać na klatę żebyś miał co jeść', 'i twój stary sam sobie gałe robił żeby ciebie nie dławić', 'i idź wpierdalać gruz', 'i wypierdalaj łowić ryby śmierdzącym kutasem', 'i twoja rodzina robi za moją wycieraczkę', 'i możesz szorować podłogę swoimi włosami z obsranej dupy', 'i możesz opierdolić gałe kosmitom', 'i chuj ci do cipy', 'i chuj ci na imie', 'i zamknij cipę', 'i stul ryj', 'i chuj w ciebie', 'i ssij gałe', 'i ssij pałę', 'i ssij kutasa', 'i ciągnij druta', 'i wal się na cyce', 'i idź se konia zwal', 'i masz małego siurka'];
    const c_words8 = ['popierdoleńcu', 'chuju', 'złamasie', 'złamany kutasie', 'krótki penisie', 'cieciu jebany', 'gnoju śmierdzący', 'obszczany debilu', 'idioto', 'ślepy krecie', 'krecie', 'sukinkocie', 'skurwysynie garbaty', 'zesikany w zasrane już gacie matkojebco', 'świnio', 'leżąca w korycie świnio'];
    const c_words9 = ['rozpędź się i pierdolnij łbem pustym o ścianę', 'usiądź na słoik i niech ci pęknie w twojej obsranej dupie', 'usiądź na butlę swoją obsraną cipą', 'kup parówki i wsadź je sobie w dupsko', 'zesraj się i to zjedz', 'zesraj się żeby ci sraka nogawką wyciekła', 'wypierdalaj do dzikusów z podkarpacia', 'idź rzucać kamieniami w helikopter', 'idź zrobić mamie arabskie gogle', 'zjedź sobie kulki kupy z włosów dupy', 'naszczaj do kibla i wsadź tam nogę', 'pierdolnij się w łeb młotkiem do obijania kotletów', 'wsadź nogę do kibla i spuść wodę', 'wysmaruj się swoją toksyczną kupą'];
    const c_words10 = ['krzywy', 'zjebany', 'zajebany', 'jebany', 'chujowy', 'popierdolony', 'wyjebany w kosmos', 'debilny', 'głupi', 'idiotyczny', 'śmieszny', 'diabelski', 'skurwysyński'];
    const c_words11 = ['diable tasmański', 'knurze', 'naplecie obrzezany', 'chuju', 'złodzieju', 'penisie', 'cieciu', 'gnoju', 'debilu', 'idioto', 'bękarcie', 'fiucie', 'sukinkocie', 'matkojebco', 'pajacu'];
    const c_words12 = ['podła', 'zła', 'niedojebana', 'chamska', 'nienormalna', 'powalona', 'obrzydliwa', 'pojebana', 'jebnięta', 'zakłamana', 'szurnięta', 'debilna', 'idiotyczna', 'przyjebana', 'zajebana', 'najebana', 'rozjebana'];
    const c_words13 = ['świnio', 'ruro jebana', 'ośmiornico', 'parówo', 'kupo gówna', 'franco', 'pijawko', 'dziwko', 'szmato', 'mendo', 'łysa cipo', 'cipo', 'owłosiona cipo', 'szmulo', 'macioro', 'gnido'];
    const c_words14 = ['wyglądasz jak', 'chodzisz jak', 'bujasz się jak', 'śmierdzisz jak'];
    const c_words15 = ['pierdolony rezus', 'kulawy menel z obciętym napletem', 'pierdolony judasz z chujem zawiązanym na supeł', 'kulawy koń jebany w obsraną dupę przez twojego starego pijanego', 'stary dziad bez nóg jebany w dupe', 'koń zwalony', 'pierdolony w dupe jebany więzień azkabanu', 'jebany w dwa baty frajer', 'obsrany w spodnie menel', 'żul pod biedronką', 'żul pod lidlem', 'pijawka w dupie', 'tasiemiec uzbrojony', 'małpa w klatce', 'krasnal sikający do buta', 'skarpeta naciągnięta na fiuta', 'debil z kondomem na głowie', 'skarpeta na miękkim fiucie', 'zaschnięte gówno na wietrze', 'menel w kałuży szczochów'];
    const c_words16 = ['sram na ciebie', 'sram ci do kawy', 'klepię twoją matkę kutasem po policzkach', 'twój stary klękał i błagał mnie na kolanach żebym jebał twoją matke', 'naszczałem twojej starej do cipy', 'sram ci do gardła', 'rozjebałem pizde twojej starej', 'sram ci do ryja', 'zesrałem się twojej starej na klatę', 'jebałem twoją starą tak że aż się zapowietrzyła', 'zeszczałem się twojemu staremu na plecy', 'pluję na ciebie totalnie', 'wysmarowałem ci drzwi gównem', 'zesikałem ci się na wycieraczkę', 'szczam na twoją rodzinę', 'sram na twój pusty łeb', 'sikam ci na łeb', 'zrobiłem arabskie gogle twojej starej'];
    const c_words17 = ['ponieważ', 'bo'];
    const c_words18 = ['twój stary napierdala skarpetami po dywanie i cię razi prądem', 'twoja matka ciągnie lache', 'twoja stara ma pizde rozjebaną tak że czołgiem tam zaparkujesz', 'wpadł mi kamień do twojej dupy i od pół godziny słyszę echo', 'twoja stara uwielbia jak ją napierdalam deską do prasowania', 'rozjebałem twojemu staremu prostatę kijem od miotły', 'masz gówno na krzywych zębach', 'połykasz spermę wielbłąda', 'twoja rodzina uwielbia zlizywać gówno z kibla', 'twojemu staremu dziadowi jebanemu już chuj nie staje', 'twoja stara musi kraść w sklepach żeby cię utrzymać', 'twój stary wywiesza gówno w skarpetach na balkonie', 'jesteś niedojebany', 'wypadłeś przy porodzie z pizdy na podłoge', 'twój stary kręci się jak chomik żebyś miał internet', 'twoja stara opierdala gałe kosmitom', 'jesteś zjebem', 'twoja stara kręci się w betoniarce', 'twój stary pijany na plecach się zesrał', 'śmierdzi ci z pyska', 'masz krzywe zęby', 'jesteś pierdolnięty na łeb', 'jesteś gnojem', 'jesteś małym śmierdzielem', 'walisz kałem', 'kondom pękł twoim rodzicom', 'guma pękła twojemu staremu', 'rozjebałbym ci gitarę na głowie', 'twoje jaja są malutkie', 'twoja cipa śmierdzi rybą', 'śmierdzisz rybą', 'masz wysypkę na dupie', 'twoja dupa pęka niczym erupcja wulkanu', 'jesteś cieciem', 'jesteś cieciem jebanym', 'twoja rodzina to ciecie', 'twoja stara zapierdala', 'twoja stara zapierdala a twój stary ją odpala'];
    const c_words19 = ['zasrańcu', 'gnoju', 'debilu', 'idioto', 'leszczu', 'patałachu', 'naplecie', 'głupku', 'skurwysynu mały', 'zjebie', 'pizdo', 'pojebańcu', 'chamie', 'kurewko', 'cipko', 'fiutku', 'bękarcie'];

    let generated_msg = `${member}, ty `;

    for(let i = 0; i < loops; i++) {
      const rng = randomIntFromInterval(1, 3);
      if(rng == 1) {generated_msg += randText1();}
      else if(rng == 2) {
        if(i == 0) generated_msg += c_words1[Math.floor(Math.random() * c_words1.length)] + ' ' + c_words2[Math.floor(Math.random() * c_words2.length)] + ' ';
        generated_msg += randText2();
      }
      else if(rng == 3) {generated_msg += randText3();}
      else {generated_msg += randText1();}
    }

    checkMessageLength.send(kurwoSkrypt.run(generated_msg, false), message);

    function randText1() {
      return c_words1[Math.floor(Math.random() * c_words1.length)] + ' ' + c_words2[Math.floor(Math.random() * c_words2.length)] + ' ' + c_words3[Math.floor(Math.random() * c_words3.length)] + ' ' + c_words4[Math.floor(Math.random() * c_words4.length)] + ' ' + c_words5[Math.floor(Math.random() * c_words5.length)] + ' ';
    }

    function randText2() {
      return c_words6[Math.floor(Math.random() * c_words6.length)] + ' ' + c_words7[Math.floor(Math.random() * c_words7.length)] + ' ' + c_words8[Math.floor(Math.random() * c_words8.length)] + ' ' + c_words9[Math.floor(Math.random() * c_words9.length)] + ' ' + c_words10[Math.floor(Math.random() * c_words10.length)] + ' ' + c_words11[Math.floor(Math.random() * c_words11.length)] + ' ';
    }

    function randText3() {
      return c_words12[Math.floor(Math.random() * c_words12.length)] + ' ' + c_words13[Math.floor(Math.random() * c_words13.length)] + ' ' + c_words14[Math.floor(Math.random() * c_words14.length)] + ' ' + c_words15[Math.floor(Math.random() * c_words15.length)] + ' ' + c_words16[Math.floor(Math.random() * c_words16.length)] + ' ' + c_words17[Math.floor(Math.random() * c_words17.length)] + ' ' + c_words18[Math.floor(Math.random() * c_words18.length)] + ' ' + c_words19[Math.floor(Math.random() * c_words19.length)] + ' ';
    }

    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  },
};