import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import path from 'path';

// Load config
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(await readFile(configPath, 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const docs = [
  {
    title: 'Islamic Beliefs & Practices (Complete)',
    description: 'The full document covering all Islamic beliefs and practices for GCSE, including Shahadah, Salah, Sawm, Zakah, Hajj, and Jihad.',
    language: 'RS (Islam)',
    price: 0,
    createdAt: Date.now(),
    content: `Islamic Beliefs & Practices
1. ‘Allah is the one true God and Muhammad is his prophet’ Shahadah

2. ‘…Ali is the friend of God’ Shia version of Shahadah

3. ‘Call on me and I will answer’ Quran

4. ‘Charity is for the poor, the needy’ Quran

5. ‘Every man has angels before him’ Quran

6. ‘Fight in the name of God against those who fight against you’ Quran

7. ‘God decrees what will happen’ Quran

8. ‘God took Ibrahim as a friend’ Quran

9. ‘It was in the month of Ramadan that the Quran was revealed’ Quran

10. ‘Muhammad is the seal of the prophets’ Quran

11. ‘On the Day of Judgement everyone will receive their judgement’ Quran

12. ‘The journey to the House is a duty owed to God’ Quran

13. ‘This is my path leading straight, so follow it’ Quran

Islamic Beliefs

1.1 Tawhid
‘Allah is the one true God and Muhammad is his prophet’ Shahadah
“He is God the One, God the Eternal” (Quran)
Tawhid (the Oneness of God), Qur’an Surah 112.
“No one is comparable to him” - Qura

1.2 Sunni & Shi’a beliefs
‘Allah is the one true God and Muhammad is his prophet’ Shahadah
‘…Ali is the friend of God’ - Shi’a version of Shahadah
- “Ali… is the master of every believer after me” (Muhammad quoted in the Hadith)
- “He will not go to [Hell] who spends his wealth to serve Allah” (Quran, believed to refer to Abu Bakr, who famously gave all his wealth to serve Allah)

1.3 Nature of God
‘Allah is the one true God and Muhammad is his prophet’ Shahadah
“There is no God but Him, the creator of all things” (Quran)
- “Misfortunes can only happen with God’s permission” (Quran) - (G-ds supremacy)
“Allahu Akbar” (G-d is great)
“He is with you wherever you are” - Quran
“It is He, the most beneficient, the merciful one” - Quran
“The most merciful established himself upon the Throne” - Quran
“The most excellent names belong to him, use them to call on him” - Quran

1.4 Angels
‘Every man has angels before him’ Quran
- “The enemy of God’s angels Jibril and Mikail is also the enemy of God” (Quran)
“Jibril and Mikail nourish the world” - Quran
“Who made Angels with 2,3,4 pairs of wings” - Quran

1.5 Predestination
- “Only what God has decreed will happen” (Quran)
- “God does not change the condition of people unless they change what is within themselves” (Quran)
“Those who defy G-d get the punishment of Hell” - Quran
“Inshallah” - (G-d willing) - said after a promise… all in Allahs hands

1.6 Life after Death
‘On the Day of Judgement everyone will receive their judgement’ Quran
- “…cups of pure drink with no intoxication, any fruit they choose, any meat they like… a reward…” (Description of Heaven, Quran)
- “Garments of fire, scalding water… melting their insides as well as their skins…” (Description of Hell, Quran)
- “…they will dwell amid scorching wind and scalding water in the shadow of black smoke…” (Description of Hell, Quran)
“Heaven is a reward for the good they do” - Quran
“Disbelievers trying to escape will be told to taste the suffering of the fire” - Quran

1.7 Prophethood & Adam
‘Muhammad is the seal of the prophets’ Quran
‘God told Adam the names of all things”
- “Every community is sent a messenger” (Quran)
- “Oh Adam… do not approach this tree…” (Quran)
- “God created Adam in His image” (Tawrat)
“He created man from clay and breathed from His spirit into him” - Quran

1.8 Ibrahim
‘God took Ibrahim as a friend’ Quran

1.9 Muhammad & The Imamate
- “Muhammad… is God’s messenger and the seal of the prophets” (Quran)
‘…Ali is the friend of God’ - Shi’a version of Shahadah
“Muhammad is the walking Quran”

1.10 The Holy Books in Islam
- “This is a truly glorious recitation” (Quran)
- “This is the Scripture in which there is no doubt” (Quran)

Islamic Practices

2.1 The Five Pillars & 10 Obligatory Acts
- “There is no God but Allah, and Muhammad is the prophet of Allah” (Shahadah)
- “There is no God but Allah, Muhammad is the prophet of Allah, and Ali is the friend of Allah” (Shia version of the Shahadah)

2.2-2.3 Salah: Prayer
‘Call on me and I will answer’ Quran
“When the call to prayer is made on the day of Jummah, hurry towards it” (Quran)
“You who believe, before your prayer wash your faces and your hands… and your feet…” (Quran)

2.4 Sawm: Fasting on Ramadan
‘It was in the month of Ramadan that the Quran was revealed’ Quran
- “The Night of Glory is better than a thousand months” (Quran)

2.5 Zakah: Charity
‘Charity is for the poor, the needy’ Quran
- “God knows the good that you do” (Quran)

2.6-2.7 Hajj: Pilgrimage
- “When you leave Arafat, remember Allah” (Quran)
‘The journey to the House is a duty owed to God’ Quran
- “Safa and Marwa are among the rites of God” (Quran)

2.6 Jihad
‘This is my path leading straight, so follow it so that you may refrain from bad’ Quran
‘Fight in the name of Allah against those who fight against you’ Quran

2.7 Eid-ul-Fitr & Eid-ul-Adha
‘It was in the month of Ramadan that the Quran was revealed’ Quran
‘God took Ibrahim as a friend’ Quran

2.8 Ashura
‘…Ali is the friend of God’
Shi’a version of Shahadah

2.9 The Festivals of Id-ul-Fitr and Id-ul-Adha
- “The prophet would not go to pray on Id-ul-Fitr before eating dates” (Quran, signifying Muhammad celebrating because dates are pleasurable)
- “…They shall mention the name of Allah… over their sacrifice” (Quran)
- “Peace and greetings to Abraham” (Quran, God calls to Abraham after he makes his sacrifice)
“You shall say G-ds name as you say the sacrifice”- Quran

2.10 The Festival of Ashura
- “There is no God but Allah, Muhammad is the prophet of Allah, and Ali is the friend of Allah” (Shia version of the Shahadah)`
  },
  {
    title: 'Judaism: Ethics & Teachings (Complete)',
    description: 'The full document covering Judaism Theme A, B, E, and F, including sexual ethics, environment, punishment, and social justice.',
    language: 'RS (Judaism)',
    price: 0,
    createdAt: Date.now() + 100,
    content: `MOST IMPORTANT

- “Don’t do to others that which you wouldn’t want done to you” (Talmud)

- “Justice you shall pursue” (Torah)

- “Let justice well up like water and righteousness flow like an unfailing stream” (Tanakh)

- “God created man in His image, male and female He created them” (Torah)

- “God said: ‘It is not good for man to be alone, I will make him a partner” (Torah)

- “Hence a man leaves his mother and father and clings to his wife’ – (Torah)

- “Do not lie with a man as one lies with a woman. It is an abomination” (Torah)

- 10 COMMANDMENTS

- “It’s not my desire that the wicked shall die, but that he may turn from his evil ways” (Ezekiel)

- “A life for a life, tooth for a tooth...” (Torah)

- “Love your fellow as you love yourself” (Torah)

- “Love the stranger, for you were strangers in Egypt” (Torah/Bible)

- “Don’t do to other what you wouldn’t want done to you” (Talmud)

- “Follow law of the land” (Talmud)

- “Many of those that sleep in the dust of the Earth will awaken, some to eternal life and others to everlasting abhorrence” (Daniel 12:2)

Theme A: Religion, Relationships and Families

3.1 Religious teachings about human sexuality
- “God said: ‘It is not good for man to be alone, I will make him a partner” (Torah)
- “Do not lie with a man as one lies with a woman. It is an abomination” (Torah)
- “God created man in His image” (Torah)

3.2 Sexual relationships before and outside marriage
- “You shall not commit adultery” (Ten Commandments)
- “You shall not covet... your neighbour’s wife” (Ten Commandments)
-“Hence a man leaves his mother and father and clings to his wife’ - Torah

3.3 Contraception and family planning
- “Be fruitful and multiply” (Torah)
- “Onan spilled his seed on the ground... and it was evil in the eyes of the Lord” (Torah)

3.4 Religious teachings about marriage
- “God said: ‘It is not good for man to be alone, I will make a helper for him’” (Torah)
-“Hence a man leaves his mother and father and clings to his wife’ – Torah
-“While Judaism teaches to respect others…we oppose same-sex relationships” (London Beth Din)

3.5 Divorce and remarriage
- “God said: ‘It is not good for man to be alone, I will make a helper for him’” (Torah)
- “A divorce is granted for all reasons and no reason” (Talmud)
- “When one divorces...even Heaven cries” (Talmud)

3.6 Religious teachings about the nature of families
-“Hence a man leaves his mother and father and clings to his wife’ - Torah
- “And you shall teach it to your children” (Shema)
- “Honour your father and mother...” (Ten Commandments)
- “Grandchildren are the crown of their elders, and the glory of children is their parents” (Proverbs)

3.7 Religious teachings about the purpose of families
- “If parents who show by example... children responds” (Talmud)
-“Teach it to your children” - Shema (in Torah)
-“Take to heart these instructions, recite them at home and away, when you lie down and get up” (Torah)

3.8 Gender equality
- “God created man in His image, male and female He created them” (Torah)
- “The woman is the glory of her husband and the children are their honour” (Talmud)
-“It is not good for man to be alone, I will make a helper for him” (Torah)

Theme B: Religion and Life

4.1 The origins of the universe
- “In the beginning, God created the heaven and the earth” (Opening words of the Torah)
- “In your sight a thousand years is like a day” (Psalms)
- “God created man in His image, male and female He created them” (Torah)

4.2 The value of the world
- “God created man in His image” (Torah)
- “Be fruitful and multiply, and dominate the earth” (Torah)
-“G-d led them around the garden of Eden… see to it that you do not spoil and destroy My world, for if you do, there will be no one else to repair it” (Ecclesiastes)
-“It is our Jewish responsibility to put the defence of the whole of nature at the centre of our concern” (Assisi Declarations on Nature)
-“One who destructively breaks vessels, rips up clothes or tears down a building… actively violates the negative commandment of ‘Do not destroy’” (Maimonides Mishnah Torah)

4.3 The use and abuse of the environment
- “Do not destroy the fruit trees when you besiege a city” (Torah)
-“Be fruitful and multiply and dominate the land, rule over... all the creatures” – Torah
-“You have made him master over your handiwork” (Psalms)

4.4 The use and abuse of animals
-“Be fruitful and multiply and dominate the land, rule over... all the creatures” - Torah
- “God created man in His image... and you shall rule over the fish of the sea and the birds of the sky and all the living things that creep upon the face of the earth” (Torah)
- “Do not muzzle an ox while it is threshing” (Torah)
-“A righteous man knows the needs for his beast” (Proverbs)

4.5 The origins of human life
- “God created man in His image, male and female” (Torah)
- “God formed man from the dust of the earth and breathed the spirit of life into him” (Torah)
- “God caused a sleep over man and took from his side; and He formed the woman from it” (Torah)

4.6 Abortion
- “The baby is not considered an independent life until it is separated from the mother” (Rashi)
- “God created man in His image, male and female” (Torah)

4.7 Euthanasia
- “A season is set for everything… a time to be born and a time to die” (Ecclesiastes)
- “God created man in His image, male and female” (Torah)

4.8 Death and the afterlife
- “Blessed are You God, King of the Universe, the True Judge” (blessing on news of a death)
- “God formed man from the dust of the earth and breathed the spirit of life into him” (Torah)
-“Many of those that sleep in the dust of the earth will awaken, some to eternal life and others to everlasting abhorrence” (Daniel 12:2)

Theme E: Religion, Crime and Punishment

7.1 Crime and Punishment
- “The wicked shall be discouraged from their evil ways” (Joshua)
-“It’s not my desire that the wicked shall die, but that he may turn from his evil ways” (Ezekiel)

7.2 Reasons for Crime
- “I charge you this day, observe my laws” (Torah)
-“It’s not my desire that the wicked shall die, but that he may turn from his evil ways” (Ezekiel)
-“Those who forsake instructions praise the wicked, but those who heed instructions fight them” (Proverbs)

7.3 Jewish attitudes to lawbreakers and different types of crime
- “Cast off the wicked” (Torah)
- “Embrace the sinner among you, for he shall repent” (Amos)
-“A child shall not share the burden of a parents guilt not shall the parent share the burden of a child’s guilt… the righteous shall be accounted for alone and the wickedness accounted for alone” (Ezikiel)
-“It’s not my desire that the wicked shall die, but that he may turn from his evil ways” (Ezekiel)

7.4 Three aims of punishment
- “A life for a life, eye for an eye...” (Torah)
-“It’s not my desire that the wicked shall die, but that he may turn from his evil ways” (Ezekiel)
-Do not hate your brother in your heart… do not bear a grudge” (Torah)

7.5 Jewish attitudes to suffering and causing suffering to others
- “I will restore my people Israel, they shall rebuild cities and inhabit them, nevermore to be uprooted from the soil I have given to them” (Amos)
- “The Torah teaches that our suffering is the punishment for the sins of our nation” (Talmud)
-“Love your fellow as you love yourself” (Torah)

7.6 Jewish attitudes to the treatment of criminals – prison, corporal punishment and community service
- “He who spares the rod, hates his son but he who loves him disciplines him early” (Proverbs)
-“Do not Murder” (10 COMMANDMENTS)
-“Do not Steal” (10 COMMANDMENTS)
-“Love the stranger, for you were strangers in Egypt” (Torah/Bible)
- “that they learn from their evil ways... that they turn from their evil ways” (Torah)

7.7 Jewish attitudes to forgiveness
- “[God said:] turn back to me; I wait for you” (Books of Writings)
- “Forgive them Father, for they know not what they do” (Jesus praying as he is being tortured and crucified, Luke)
-“Come let us reach an understanding” (Isaiah)
-“Be your sins like crimson, they can turn snow-white; be they red as dyed wool, they can become fleece” (Isaiah)

7.8 Religious attitudes to the death penalty
- “Whoever sheds the blood of man, by man shall his blood be shed” (Torah)
- “A life for a life, tooth for a tooth...” (Torah)
-“God made man in His image, male and female” (Torah)
-“It’s not my desire that the wicked shall die, but that he may turn from his evil ways” (Ezekiel)

Theme F: Religion, Human Rights and Social Justice

8.1 Human Rights
- “Everyone is entitled to the rights and freedoms set out in this declaration” (UDHR)
- “On three things the World stands: on justice, on truth and on peace” (Talmud)
- “Love your fellow as yourself” (Torah)
-“God made man in His image, male and female” (Torah)
-“You must not carry false rumours” (Torah)
-“Guard your tongue from evil, your lips from deceitful speech” (Psalm)

8.2 Social Justice
- “Love the stranger as you love yourself for you were once strangers in Egypt” (Torah)
-“God made man in His image, male and female” (Torah)
-“Let justice well up like water and righteousness like an unfailing stream” (Prophets)
-“Justice you shall pursue” (Torah)
-“The world stands of 3 things: Law, truth and peace” (Ethics of the Father)

8.3 Religious Freedom
- “There are many ways to reach God and each religion speaks some truth” (Lord Sacks)
- “If you call, I will listen” (God speaking in the Books of Writings)
- “Love your fellow as yourself” (Torah)
-“God made man in His image, male and female” (Torah)

8.4 Prejudice and discrimination
- “Do not lie with a man as one lies with a woman, it is an abomination” (Torah)
- “He who stands aside while his brother’s blood is shed, his blood is on his hands” (Talmud)
- “Love your fellow as yourself” (Torah)
-“God made man in His image, male and female” (Torah)

8.5 Women in Judaism
- “God created man in His image, male and female He created them” (Torah)
- “The woman is the glory of her husband and the children are their honour” (Talmud)
-“It is not good for man to be alone, I will make a helper for him” (Torah)
-“You shall not boil a kid in his mothers milk” (Torah)

8.6-8.8 Wealth, Poverty, Exploitation & Charity
- “God gives you your wealth” (Torah)
- “you shall set aside one tenth of what you bring in from your field for the poor and the needy” (Torah)
“Wealth is given from God. It is for helping others. This is the meaning of tzedakah” (Torah)
- “Do not put a stumbling block in front of the blind” (so not to exploit the weak – Torah)
- “you shall not pick your vineyard bare... leave them for the poor and the stranger” (Torah)
- “Love your fellow as yourself” (Torah)
-“God made man in His image, male and female” (Torah)
-“Be honest in business” (Torah)`
  }
];

async function run() {
  console.log('Clearing old shop documents...');
  try {
    const snapshot = await getDocs(collection(db, 'shopContent'));
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }
  } catch (e) {
    console.log('Warning: Could not clear shop content (might be empty or permissions issue).', e.message);
  }

  console.log('Inserting shop documents...');
  for (const docData of docs) {
    const res = await addDoc(collection(db, 'shopContent'), docData);
    console.log(`Added: ${docData.title} (ID: ${res.id})`);
  }
  console.log('Done!');
  process.exit(0);
}

run();
