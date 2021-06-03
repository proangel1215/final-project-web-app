/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required...
 */

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id INTEGER NOT NULL PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    username VARCHAR(20),
    dob DATE,
    password VARCHAR(50),
    description VARCHAR(300),
    imageSource VARCHAR(100),
    authToken VARCHAR(128),
    admin BIT
);

-- for the admin column, the bit datatype will store 1 for true and 0 for false (no Boolean data type)

CREATE TABLE articles (
    id INTEGER NOT NULL PRIMARY KEY,
    title VARCHAR(100),
    postTime TIMESTAMP,
    content VARCHAR(8000),
    imageSource VARCHAR(100),
    userID INTEGER, 
    username VARCHAR(20), 
    FOREIGN KEY (userID) REFERENCES users(id)
);

CREATE TABLE comments (
    id INTEGER NOT NULL PRIMARY KEY,
    postTime TIMESTAMP,
    content VARCHAR(300),
    upvotes INTEGER,
    downvotes INTEGER,
    parentCommentID INTEGER,
    commenterID INTEGER,
    articleID INTEGER,
    FOREIGN KEY (commenterID) REFERENCES users(id),
    FOREIGN KEY (articleID) REFERENCES articles(id),
    FOREIGN KEY (parentCommentID) REFERENCES comments(id)
);

CREATE TABLE votes (
    voterID INTEGER NOT NULL, 
    commentID INTEGER NOT NULL,
    PRIMARY KEY (voterID, commentID),
    FOREIGN KEY (voterID) REFERENCES users(id),
    FOREIGN KEY (commentID) REFERENCES comments(id)

);

INSERT INTO users VALUES (1, 'Hollie', 'White', 'hols', '1994-03-20', '$2b$10$sxioZDL6KnmOZ1XN3BtPputkHrHk7pcrJUsL1HFGV4SneY7akhWMm', 'Love my life', 'dragon-icon.png', 'null', 1);
INSERT INTO users VALUES (2,'Matthew', 'Ding', 'matt', '1997-09-14', '$2b$10$s9fGaUDYtlvsTU71RrRUtOP7ZOx1ZQuHqIZeKvYVG/BLBRNjzW1s2', 'Enjoying cricket and life', 'sloth-icon.png', 'null', 1);
INSERT INTO users VALUES (3,'Declan', 'Williams', 'declan', '2000-03-23', '$2b$10$eMczFg51lxdIWNAJi8lrTODDXRwkWbWsQlKX06swXqf/bUGBqCI/6', 'Lorem ipsum dolor sit amet.', 'dino-icon.png', 'null', 1);
INSERT INTO users VALUES (4,'Rachel', 'Yang', 'rachel', '2001-05-11', '$2b$10$B/CLSlIxyxySDeawZnl5ROwAxrIftLRTGqxgjukFkCpa8kGS.UYlW', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper ex eget dui rhoncus congue. Integer eget nisl laoreet nisl eleifend elementum.', 'bear-icon.png', 'null', 0);
INSERT INTO users VALUES (5,'Vita', 'Tsai', 'vita', '1990-11-11', '$2b$10$AQKuMYmocFmo4alOM/Xdke.pKYyKdt15dvI/U5dAKlG61sLSFgEqW', 'I love science and teaching 718', 'fox-icon.png', 'null', 0);
INSERT INTO users VALUES (6,'Tyne', 'Crow', 'tyne', '1990-11-11', '$2b$10$b2q9HGDoCmaar6fh9Nj0.uNvolNAU8OnxcDJgWx9WyA3/yISbEszW', 'Loving photography and teaching 719', 'parrot-icon.png', 'null', 0);
INSERT INTO users VALUES (7,'Andrew', 'Meads', 'andrew', '1990-11-11', '$2b$10$EaZrj1oDd4ezGCB1DJZ4AOlJSdFsUlRJ72CE62jWM9bdQDWzvAhpq', 'Loving singing and teaching online', 'alpaca-icon.png', 'null', 0);
INSERT INTO users VALUES (8,'Yu Cheng', 'Tu', 'yucheng', '1990-11-11', '$2b$10$L919kSukv/2SCcqnj0S.U.Fnt2ddhRG77ti5AO2oCorG5d6ExO4C.', 'I love to assign extremely diffucult javascript test questions', 'octopus-icon.png', 'null', 0);

INSERT INTO articles VALUES (1, 'Review: Avatar the Last Airbender is still amazing', '2021-01-19 03:14:07','<p><span style="margin: 0px; padding: 0px;">Despite being 15 years old, Avatar the Last Airbender (ATLA) is still an entertaining, nicely paced and an awesome TV series.</span></p>
<p><span style="margin: 0px; padding: 0px;">ATLA starts off with Katara and her brother, Sokka, two members of the Southern Water Tribe, fishing. When Sokka makes a sexist remark and angers his sister into waterbending, they discover a boy trapped in a glacier.</span></p>
<p><span style="margin: 0px; padding: 0px;">The boy, Aang, turns out to be the last airbender, the destined avatar.</span></p>
<p><span style="margin: 0px; padding: 0px;">We then see an entire culture in a war-stricken world. There are people who can bend the elements earth, fire, wind and air. The avatar is the only person who can bend all the elements and work to keep peace and balance in the world.</span></p>
<p><span style="margin: 0px; padding: 0px;">The Fire Nation has started taking over colonies and is trying to take over the world when Sozin&rsquo;s comet arrived 100 years before the story starts. They killed all the airbenders to stop the avatar, who was supposed to resurrect as an airbender.</span></p>
<p><span style="margin: 0px; padding: 0px;">There are amazing characters and unappreciated jokes throughout the entire series anyone can appreciate as they watch. From the cabbage merchant that has no real role in the series, but keeps appearing everywhere, to Sokka&rsquo;s puns and boomerang.</span></p>
<p><span style="margin: 0px; padding: 0px;">One of the things that should be appreciated most is the character redemption Zuko, the banished prince of the Fire Nation, gets. We see him and his uncle, Iroh, in the very beginning of the series as a villain who wants to capture the avatar in order to restore his honor.</span></p>
<p><span style="margin: 0px; padding: 0px;">As the show progresses, we see Zuko&rsquo;s past and watch him grow. With the guidance of his uncle and a few mistakes, we see him find his path and restore his honor as one of the best characters in the show.</span></p>
<p><span style="margin: 0px; padding: 0px;">As a writer, I appreciate the redemption arc for Zuko more than anything and strive to achieve&nbsp;</span></p>
<p><span style="margin: 0px; padding: 0px;">something that amazing and well-written in my own work. It was subtle and moved throughout the entire series. Zuko&rsquo;s motivations and desires are written clearly.</span></p>
<p><span style="margin: 0px; padding: 0px;">The show also covers intense topics. We see Katara coming to terms with her mother&rsquo;s murder, Zuko facing his own demons and turning against his family, Iroh being a lovable character to everyone by accepting his dark past.&nbsp;</span></p>
<p><span style="margin: 0px; padding: 0px;">We also see Aang face guilt and PTSD at 12 years old. Despite being made for kids, ATLA is a heavy show for anyone and a timeless series.</span></p>
<p><span style="margin: 0px; padding: 0px;">The show is on Netflix now, along with its sequel, Legend of Korra.</span></p>
<p><span style="margin: 0px; padding: 0px;">Overall, I give the show 5/5 stars.</span></p>', 'avatar-article1.jpg', 1, 'hols');

INSERT INTO articles VALUES (2, '‘Danny Phantom’ Was a Nicktoon Too Ahead of Its Time', '2021-04-24 04:20:00','<p>Whether you watch them seriously, as a nostalgic throwback, or with your children, we all have opinions on cartoons. For years, Nickelodeon has been one of the undisputed rulers of the animated world, and the network has produced some largely agreed upon animated classics. <em><u>Rugrats</u></em>,&nbsp;<em><u>Hey Arnold!</u></em>, and&nbsp;<em><u>SpongeBob SquarePants</u></em>&nbsp;all fall into this category. However, there&rsquo;s one great Nicktoon that never received the praise it deserved &mdash;&nbsp;<em><u>Danny Phantom</u></em>.</p>
<p>Created by Butch Hartman (<em><u>The Fairly OddParents</u></em>), the three-season show was more of an animated teen dramedy with ghosts than anything else the network has released.&nbsp;<em>Danny Phantom</em>&nbsp;takes&nbsp;place in a world where ghosts are real and follows Danny Fenton, a socially awkward teenager who develops superpowers after an accident with the Ghost Portal. It&rsquo;s a classic reluctant-hero-coming-into-his-own story but with quips and a parallel dimension full of dead spirits. The series always balanced its two sides well. On a plot level, the show existed in a complicated otherworldly universe full of nefarious villains, deception, and secret plans. In that way, it was very much like a&nbsp;comic book or an installment of&nbsp;<em>Final Fantasy</em>. However, viewers were led into this universe by three friends who wouldn&rsquo;t be out of place on&nbsp;<em><u>Freaks and Geeks</u></em>. Danny was an everyman and an insecure hero, his best friend and occasional love interest Sam was a fierce goth chick who was unapologetically her own person, and his other best friend Tucker was a tech geek who often served as the show&rsquo;s comedic relief. It was a winning combination that should have appealed to both Nickelodeon&rsquo;s core audience and older viewers.</p>
<p>Perhaps because it was a bit too genre-savvy for its time or perhaps because Nickelodeon had a competitive slate of shows from 2004 to 2007,&nbsp;<em>Danny Phantom</em>&nbsp;never took off the way other Nicktoons did. This wasn&rsquo;t for lack of trying on Nick&rsquo;s part. The series was heavily advertised, and Danny can be seen in many Nickelodeon ads as well as tie-in games and merchandise from this time period. The show ended after its third season, an epic departure from past episodes that pitted Danny, his best friends, his sister, and his clone against the biggest bad guy the series had ever seen. More than any other plot line, Danny&rsquo;s fight against Vlad revealed the series&rsquo; ability to be an intense and deeply fun superhero show.</p>
<p><em>Danny Phantom</em> may have ended before reaching its full potential for awesomeness, but there&rsquo;s still hope for fans. In February of last year, Nickelodeon released a short featuring all of Hartman&rsquo;s characters that was closely attached to <em>Danny Phantom</em>. Not only that, but&nbsp;Hartman released a YouTube video a few months ago, showing what the three main protagonists would look like as adults. Typically, I&rsquo;m opposed to reboots, but it&rsquo;s hard to argue against Danny and co. fitting in in today&rsquo;s superhero-obsessed world. But until that reboot announcement (hopefully) comes, we still have the original series. If you&rsquo;re a fan of classic Nicktoons but are looking for something you may have missed, check it out. It&rsquo;s worth it if only for the Box Ghost.</p>', 'dannyphantom-article2.jpg', 2, 'matt');

INSERT INTO articles VALUES (3, 'Dragon Ball Z: Season 1 Review', '2021-04-20 11:01:07','<p><em>In its simplest form, </em>Dragon Ball Z is an animated soap opera complete with big fights, bright, vibrant animation and well written characters. Its loud, oftentimes intense and its unique blend of fighting and good pacing techniques make it an impressive animated outing with a great story. The physical humour may not translate well outside the Japanese market where the physical slapstick humour may be lost or cringe-inducing, but Dragon Ball Z succeeds in creating some memorable characters and epic fights throughout its entirety that makes it easy to overlook its shortcomings in this area.</p>
<p>The story for the first season sees super powered saiyan Goku and a plethora of colourful characters tasked with protecting the Earth when the villainous Raditz appears. He boasts that two more powerful saiyans will arrive on Earth following his tough fight with the heroes and what ensues is a season of training and ultimately fighting these new threats. On the whole, the season is well paced with only a handful of filler episodes that unncessarily pad the story out. Its not perfect, and every episode does end on a cliffhanger to keep the dramatic tension high. While this isn&rsquo;t necessarily a bad thing, if you intend on watching a lot of episodes in one go or aren&rsquo;t a fan of this technique then it can sometimes become a little tedious.</p>
<p>The first season of Dragon Ball Z does a great job of introducing a vast list of characters with intricate relationships in a short space of time. This attention to detail and great script writing through the majority of this season is one of the reasons that the show has been running for so long. Some of the characters, including Goku&rsquo;s wife Chi Chi and the supporting cast at Kami&rsquo;s House act as filler to break up the fighting and with the exception of Master Roshi don&rsquo;t really bring anything to the show except providing comedic relief. I mentioned earlier that these scenes do sometimes drag or come across as cringe-inducing, with the physical humour likely to be lost on Western audiences.</p>
<p>Having said all of this though, the animation on the whole is very good, with a nice use of colour used throughout. There are times where it doesn&rsquo;t always hit, some of the line drawing isn&rsquo;t perfect and some of the colours feel a little too saturated but its a nitpick and barely noticeable. With a vast array of characters and an array of settings throughout the season, Dargon Ball Z is a visually pleasing anime with a great eye for colour and detail.</p>
<p>Overall then, the first season of Dragon Ball Z does a good job of establishing the universe and characters that inhabit the world. The ongoing story makes it an easy watch, one that quickly grips you and makes it hard to stop watching. The fighting is top notch too, with some impressive effects and animation to accompany the realistically depicted voice acting throughout. Whilst its story does drag at times, especially during the quiet middle portion that features a few filler episodes, the climactic fight that dominates the latter portion of this season makes it worth the wait. Its not perfect, and the season does have some niggling issues, but on the whole, the first season of Dragon Ball Z is a successful one.</p>.', 'dragonballz-article3.jpg', 3, 'declan');

INSERT INTO articles VALUES (4, 'Why you should watch ‘Totally Spies!’ as an adult', '2021-03-19 03:16:08','<p>Firstly, it&rsquo;s visually stunning. As a hardcore anime fan, I&rsquo;m a sucker for the good old 2D cartoon. It&rsquo;s stunning at any given frame, especially in that Barbie-meets-fashion-sketch category&nbsp;<em>Totally Spies!</em>&nbsp;falls under. The more I&rsquo;m bombarded with trailers of new big animation studio productions, featuring the minions and boss babies of the digital world, with their freakishly large heads and play dough-textured faces, the more I long for simpler times, when Mickey&rsquo;s ears appeared to sit on one side of his head and vehicles were non-sentient.</p>
<p>Secondly, it&rsquo;s creative and random. The&nbsp;<em>TS</em>&nbsp;squad, composed of Clover, Sam, and Alex (also known as red, green and yellow spy respectively) can be seen going about your standard TV show high school life, when they are somehow drawn into the ground below: a literal hole forms beneath their feet, the bench they&rsquo;re sitting on decides to take a dive into the unknown, a whirlpool pulls them down the bottom of a hot tub, and they find themselves inside the accursed bottomless elevator&hellip; The free fall always ends in a top secret portable office belonging to Jerry, their spy-manager bossman, and also head of Woohp, a suspiciously vague secret agency with questionable priorities. Most of their missions revolve around the&nbsp;<em>TS</em>&nbsp;universe&rsquo;s most vicious threat: emerging celebs mysteriously becoming overnight sensations. Things get increasingly creative as the episodes go by, which is definitely something to look forward to while binge-watching the show.</p>
<p>Arguably the most iconic part of the show is the gadgets. Whilst vaguely touching upon the day&rsquo;s mission, Jerry reminds us what we actually came for: there&rsquo;s a magnetic belt with a heart-shaped buckle, an inflatable pink vest, hologram-projecting heart gemstone rings, fashion-forward titanium chunky-heeled boots, a foundation-shaped communication device used for facetiming Jerry, and last but not least (Jerry&rsquo;s personal favourite) an obscure acronym that stands for whatever ends up saving the day this time. Don&rsquo;t even bother pretending you don&rsquo;t need all these gadgets in your life as bad as you did when you were younger.</p>
<h2 style="text-align: center;"><strong>"there is enough graphic, skin-crawling content to keep a horror film franchise going for many, many sequels"</strong></h2>
<p>It&rsquo;s also fascinatingly creepy for a kids show. In an episode called &ldquo;Model Citizens&rdquo;, the girls end up in a fashion show, where the mystifying overnight sensation Gazelle charms the audience with her unblemished looks. As soon as she retires to her dressing room, Alex uses the power of some laser beaming eye contacts to arrive to a shocking discovery:</p>
<p>*WARNING, the following content has been rated N, for Nightmarish. Please proceed with caution*</p>
<p>The gentle removal of Gazelle&rsquo;s silk gloves reveals a pair of arms utterly clashing her skin tone, ending in equally multicoloured fingers, all wrapped in stitch marks! Gah! If you&rsquo;ve watched a substantial amount of&nbsp;<em>TS</em> episodes, I&rsquo;m sure the infamous horror scene is currently revived afresh in your mind&rsquo;s eye, likely to remain there for the next couple of nights. Would you be surprised if I told you that Gazelle later drops an&hellip; Ear? In the episodes I&rsquo;ve seen so far, there is enough graphic, skin-crawling content to keep a horror film franchise going for many, many sequels.</p>
<h2 style="text-align: center;"><strong>"The focus lies on spectacular action scenes and punch line opportunities more than anything"</strong></h2>
<p>Finally, one of the show&rsquo;s strengths is that it is satisfyingly self-aware. Throughout the episodes, the girls seem more invested in their appearance and any persisting teen drama that awaits them back home, rather than the mission itself. When Clover eventually gets kidnapped (which happens in almost every episode), Sam and Alex don&rsquo;t look particularly concerned, and instead focus on investigating the case a bit further, as if already knowing that their findings will inevitably lead to a living, breathing Clover. The show plays with its own conventions like that quite hilariously, being fully aware that no one, not even the youngest viewer, would really be on the edge of their seat over the main character&rsquo;s short absence.</p>
<p>The focus lies on spectacular action scenes and punch line opportunities more than anything, to the extent where the &lsquo;cool&rsquo; factor overrides any logic or cohesion of plot a lot of the time. The gadgets are oddly specific, so much so that Jerry appears to be extraordinarily gifted in the intuition department, thus accurately foreseeing each and every action scene, down to the last detail. And frankly, it&rsquo;s&nbsp;<em>totally</em>&nbsp;awesome!</p>', 'totallyspies-article4.jpg', 4, 'rachel');

INSERT INTO articles VALUES (5, 'Why Digimon is Superior to Pokemon', '2021-06-20 02:16:07','<p>If you grew up in the &rsquo;90s, chances are your first exposure to anime was either&nbsp;<em>Pok&eacute;mon&nbsp;</em>or&nbsp;<em>Digimon</em>, and your parents would regularly mix one up with the other. Honestly, it&rsquo;s not that hard to see why. Both shows originated as video games &ndash;&nbsp;<em>Digimon&nbsp;</em>started out as Tamagotchi-like virtual pets and&nbsp;<em>Pok&eacute;mon</em>&nbsp;was a series of&nbsp;role-playing games &ndash; before expanding to trading cards, TV shows, and movies.</p>
<p>While&nbsp;<em>Pok&eacute;mon&nbsp;</em>grew to become a multimedia juggernaut that has churned out TV seasons non-stop since 1997 and produced over 20 feature films,&nbsp;<em>Digimon&nbsp;</em>has quietly but steadily remained in its shadow since it premiered in 1999. But with the recent release of&nbsp;<em>Digimon Adventure: Last Evolution Kizuna</em>, and with the franchise&rsquo;s first film, celebrating its 20th anniversary this month, it&rsquo;s about time we take out our Digivice, become champions of the Digital World, and explore why Digimon is the superior &rsquo;90s franchise about young kids who befriend small fighting monsters.</p>
<h3><strong>IT&nbsp;WAS APPOINTMENT TV</strong></h3>
<p>By the late &rsquo;90s, we were already entering the era of prestige TV, as the arrival of shows like&nbsp;<em>The Sopranos</em>&nbsp;and&nbsp;<em>The West Wing</em>, with a stronger focus on serialized narratives, forced people to tune in every week or risk missing important plot points. Though children&rsquo;s television at the time was mostly episodic,&nbsp;<em>Digimon&nbsp;</em>marked a groundbreaking development for many kids of the era who discovered that they too had to&nbsp;watch every episode if they wanted to follow along with the story.</p>
<p>Many episodes ended on cliffhangers, characters experienced genuine story arcs, and smaller events and characters were frequently referenced later. Sometimes, major characters would be separated from each other for weeks at a time, and side characters would suddenly become important. This made for a more challenging but rewarding experience that treated children like&nbsp;a serious TV-viewing audience. More than anything, the show trusted its young viewers to keep up with its&nbsp;narrative week by week, so that by the time the epic finale came each season, the anticipation for it had been building for months.</p>
<h3><strong>IT TACKLED MATURE SUBJECTS</strong></h3>
<p><em>Digimon</em>&nbsp;is very much a Saturday morning cartoon-style show aimed at kids, but it got away with a surprising amount of depth. Unlike many of its contemporaries,&nbsp;<em>Digimon&nbsp;</em>featured character development that would unfold over the course of each season. The second season spent a lot of time telling the story of the self-proclaimed Digimon Emperor, who is consumed by darkness and begins to take over the Digital World before atoning for his sins&nbsp;in a redemption arc that spans several episodes.</p>
<p>The show also explored themes that were relatable to kids but seldom seen in kids&rsquo; cartoons, like exploring the effects of&nbsp;a divorce on a family, the pressure of living up to&nbsp;one&rsquo;s family&rsquo;s expectations, or the grief&nbsp;of losing a loved one. In the third season, a character named Jeri is even thrown into a weeks-long depression after the death of a Digimon friend. Indeed,&nbsp;<em>Digimon&nbsp;</em>fully acknowledged that its titular creatures are dangerous beings, and danger lurks behind every corner, sometimes with devastating results. The show was upbeat and action-packed for the most part, but it was never afraid to pull at your heartstrings, either.</p>
<h3><strong>ITS STAKES WERE INCREDIBLY HIGH</strong></h3>
<p><em>Digimon</em>&nbsp;isn&rsquo;t about collecting all the monsters, or about fighting a new villain each week; it&rsquo;s about kids on a mission to literally save the world. No offense to Jessie and James of&nbsp;<em>Pok&eacute;mon</em>&lsquo;s Team Rocket, but they aren&rsquo;t the most competent villains out there. Meanwhile, the Digital World of&nbsp;<em>Digimon</em>&nbsp;is home to some seriously monstrous villains capable of ruthless evil. Each season hinges on world-ending stakes that require the kids to work against all odds with the help of a friend or two to win the day. In most of the seasons (as well as the recent movie and new reboot), the Digital World even leaks into the real world, threatening to destroy everything.</p>
<p>Such high stakes have meant that the series has&nbsp;lost more than a few of its characters. This may be a children&rsquo;s show, but&nbsp;<em>Digimon&nbsp;</em>has never been afraid to kill off beloved heroes in heartbreaking ways &mdash; we still haven&rsquo;t healed from the devastating loss of Wizardmon in the original series. Plenty of friends and allies have met their demise&nbsp;over the course of the show,&nbsp;so much so that one character held a funeral for lost friends during the first season. But sure, remind me how sad it was when Ash said goodbye to Butterfree &mdash; which wasn&rsquo;t even permanent.</p>
<h3><strong>THE MOVIE IS BONKERS AND HAS A FANTASTIC, TOTALLY &rsquo;90S SOUNDTRACK</strong></h3>
<p>Speaking of high stakes, the plot of&nbsp;<em>Digimon: The Movie</em>&nbsp;is completely nuts. The main characters (still 10 years old, by the way) literally have to prevent a nuclear warhead from exploding over Tokyo after a virus-infected Digimon takes over the U.S. nuclear arsenal specifically to target a couple of kids. It takes a while&nbsp;for the kids to bring the fight to the bad guy, though, because they also have to battle&hellip; slow internet connections and the&nbsp;unreliable email.</p>
<p>Considering the movie was cobbled together from three short films and packaged for release outside of Japan, it&rsquo;s a wonder the story makes any sense at all. It&rsquo;s also worth noting that two of those three short films were the early efforts of acclaimed director Mamoru Hosoda.</p>
<p>But the greatest thing about&nbsp;<em>Digimon: The Movie&nbsp;</em>isn&rsquo;t its ludicrous story,&nbsp;but its bizarre &mdash; yet surprisingly solid &mdash; soundtrack.&nbsp;Just as&nbsp;<em>Pok&eacute;mon: The First Movie&nbsp;</em>included songs by Christina Aguilera, Britney Spears, and NSYNC, the producers of&nbsp;<em>Digimon&nbsp;</em>went all out to make their movie the most &rsquo;90s event ever. In addition to the show&rsquo;s theme song, which reflects a time when every anime show was marketed to American audiences with hip hop, the film&rsquo;s pop soundtrack includes everything from Fatboy Slim, Barenaked Ladies&rsquo; sexually-charged &ldquo;One Week,&rdquo; and a fantastic cover of &ldquo;Kids in America&rdquo; by Len to a pre-<em>Shrek</em>&nbsp;&ldquo;All Star&rdquo; by the one and only Smash Mouth to close out the film. That&rsquo;s right, pre-<em>Shrek</em>. Meme or not, that&rsquo;s hard to top.</p>
<h3><strong>IT KNEW HOW TO END</strong></h3>
<p>Franchises eventually change, whether they&rsquo;re&nbsp;<em>Star Wars</em>, Marvel, or&nbsp;<em>Toy Story</em>, but&nbsp;<em>Pok&eacute;mon</em>,&nbsp;despite an occasional change of scenery, has otherwise remained pretty much the same, plot- and character-wise.&nbsp;<em>Digimon</em>, on the other hand, always knew its audience was eventually going to grow up, so it grew up with them. 2015 saw the release of&nbsp;<em>Digimon Tri</em>, a series of movies that picked up 5 years after the end of the original show, with the characters now in high-school. Then,&nbsp;<em>Digimon Adventure: Last Evolution Kizuna&nbsp;</em>came out earlier this year and, like&nbsp;<em>Toy Story 3&nbsp;</em>did for a little while, actually dared to say goodbye to the franchise with a story that signals from the get-go that it will be Agumon and Tai&rsquo;s final adventure.</p>
<p><em>Digimon</em>&lsquo;s audience came of age with the franchise because&nbsp;<em>Digimon</em>&nbsp;is a coming-of-age story. It recognized its place in the audience&rsquo;s life and has grown to reflect the same changes its audience has experienced.&nbsp;<em>Digimon</em>&nbsp;knows some things from our childhood will inevitably have to be left behind. Though the series was ultimately rebooted earlier this year,&nbsp;<em>Last Evolution Kizuna&nbsp;</em>puts a bittersweet bow on 20 years of adventures that began with&nbsp;<em>Digimon Adventure</em>&nbsp;and&nbsp;<em>Digimon: The Movie</em>, which is an example that more franchises&nbsp;honestly should follow.</p>', 'digimon-article5.jpg', 1, 'hols');

INSERT INTO comments VALUES (1, '2021-04-20 11:01:07', 'This is the best show ever.', 4, 0, NULL, 3, 1);
INSERT INTO comments VALUES (2, '2021-03-10 05:00:07', 'This isnt even real anime...', 0, 1, 1, 2, 1);
INSERT INTO comments VALUES (3, '2021-04-20 11:01:07', 'My favourite character is Sokka', 2, 0, NULL, 4, 1);
INSERT INTO comments VALUES (4, '2021-01-12 06:05:00', 'Danny was my first crush...', 8, 0, NULL, 1, 2);
INSERT INTO comments VALUES (5, '2021-02-16 04:20:07', 'I need to rewatch this!', 6, 0, NULL, 2, 3);
INSERT INTO comments VALUES (6, '2021-01-14 08:40:06', 'I recently did it did not hold up tbh', 0, 4, 5, 6, 3);
INSERT INTO comments VALUES (7, '2021-03-11 08:15:06', 'Yesss I love this show', 1, 1, NULL, 1, 4);
INSERT INTO comments VALUES (8, '2021-06-14 09:40:06', 'I need to watch this again...', 0, 0, 7, 5, 4);
INSERT INTO comments VALUES (9, '2021-06-14 09:40:06', 'Oh, this is blasphemy...', 7, 0, NULL, 7, 5);
INSERT INTO comments VALUES (10, '2021-06-14 09:40:06', 'Yup, who do they think they are kidding..', 2, 0, 9, 5, 5);
INSERT INTO comments VALUES (11, '2021-06-14 09:40:06', 'I lowkey agree', 0, 4, NULL, 6, 5);
INSERT INTO comments VALUES (12, '2021-06-14 09:40:06', 'Smh', 2, 0, 11, 8, 5);

INSERT INTO votes VALUES (1, 1);
INSERT INTO votes VALUES (2, 2);
INSERT INTO votes VALUES (3, 3);
INSERT INTO votes VALUES (2, 3);
INSERT INTO votes VALUES (1, 5);
INSERT INTO votes VALUES (2, 5);
INSERT INTO votes VALUES (3, 5);
INSERT INTO votes VALUES (2, 6);
INSERT INTO votes VALUES (4, 6);
INSERT INTO votes VALUES (3, 7);
INSERT INTO votes VALUES (2, 7);