export interface Question {
  id: number
  text: string
  answers: string[]
  correct: number
  photo?: string
  video?: string
  timeLimit?: number
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Bahar’ın fav pony’sinin ismi nedir?",
    answers: ["Miss", "Charlie", "Çilek", "Angel"],
    correct: 2,
    photo: "bahar-pony.jpeg",
    timeLimit: 45
  },
  {
    id: 2,
    text: "Bahar küçükken hangi barbieydi?",
    answers: [
      "Prenses ve terzi kızı esmer kız",
      "Kristal şato esmer kız",
      "Barbie Pegasus",
      "Barbie Kuğu Gölü"
    ],
    correct: 0,
    photo: "bahar-barbie.jpeg",
    timeLimit: 45
  },
  {
    id: 3,
    text: "Bahar 6-7 yaşındayken annesi şaka amaçlı Ömer’e polis aradığını söylediğinde Bahar ne yapmıştır?",
    answers: [
      "Annesiyle kavga çıkardı",
      "Ömer’e rahat etmesi için çanta hazırlamak",
      "Polis’e saldırdı",
      "Annesinin üzerine geri polisleri aradı"
    ],
    correct: 1,
    photo: "bahar-polis.jpeg",
    timeLimit: 45
  },
  {
    id: 4,
    text: "Bahar at bindiği kulüpte neydi?",
    answers: ["Popüler kız", "En nefret edilen", "Pick me gurlll", "İçine kapanık olan"],
    correct: 0,
    photo: "bahar-horse.jpeg",
    timeLimit: 45
  },
  {
    id: 5,
    text: "Anneannesinin Bahar’a taktığı lakap neydi?",
    answers: ["İpek Böceği", "Bok Böceğim", "Gül Yaprağı", "İncim"],
    correct: 0,
    photo: "bahar-nickname.jpeg",
    timeLimit: 45
  },
  {
    id: 6,
    text: "Babası ilkokulda Bahar’ı nasıl ağlatıyordu?",
    answers: ["Ege", "Poyraz", "Rüzgar", "Bora"],
    correct: 3,
    photo: "bahar-crying.jpeg",
    timeLimit: 45
  },
  {
    id: 7,
    text: "Bahar birinci sınıfta yazı yazmayı öğrendikten sonra not defterine ne yazmıştır?",
    answers: [
      "Baştan sona alfabeyi yazmıştır",
      "Okulun aşk kitabını yazmıştır",
      "Ömer’i şikayet eden bir yazı yazmıştır",
      "At hakkında akrostiş şiir yazmıştır"
    ],
    correct: 1,
    photo: "bahar-notebook.jpeg",
    timeLimit: 45
  },
  {
    id: 8,
    text: "Bahar, annesi ilkokulda Ömer’i okuldan almaktan tehdit ettiğinde ne yapmıştır?",
    answers: [
      "Oh çekmiştir",
      "O da okula gitmeyi reddetmiştir",
      "Annesine A4’lük eğitim haklarıyla alakalı mektup yazmıştır",
      "Ömer için derste not çıkarmıştır"
    ],
    correct: 2,
    photo: "bahar-letter.jpeg",
    timeLimit: 45
  },
  {
    id: 9,
    text: "Bahar kolunu nasıl kırmıştır?",
    answers: [
      "Kayak yaparken ağaca girmiştir",
      "Attan düşmüştür",
      "Muzdan düşmüştür",
      "Çok sert 31 çekmiştir"
    ],
    correct: 0,
    photo: "bahar-arm.jpeg",
    timeLimit: 45
  },
  {
    id: 10,
    text: "Bahar ilk regl olduğunda ne demiştir?",
    answers: [
      "Ne yani her ay olacak mıyım",
      "Ben de zaten ped var",
      "Leyla'ya geri tokat atmıştır",
      "Kayak kaymaya devam etmek istiyorum demiştir"
    ],
    correct: 0,
    photo: "bahar-regl.jpeg",
    timeLimit: 45
  },
  {
    id: 11,
    text: "Bahar ve Leyla küçükken hangi cezayı en çok almışlardır?",
    answers: [
      "Etek elbise cezası",
      "Oyuncak cezası",
      "Anneanne babaanneye gidemezsin cezası",
      "Odaya kilitleme cezası"
    ],
    correct: 0,
    photo: "bahar-punishment.jpeg",
    timeLimit: 45
  },
  {
    id: 12,
    text: "Bahar’la Balca okulda sevmedikleri birini görünce ne yaparlar?",
    answers: [
      "Kafalarını çevirirler",
      "Selam verirler",
      "Selam verip gittiği saniye arkasından konuşurlar",
      "Bahar’la Balca herkesi seviyor"
    ],
    correct: 2,
    video: "bahar-school.mp4",
    timeLimit: 45
  },
  {
    id: 13,
    text: "Balca, Bodrum’da eczanede hangi ilacı alırken utanıp Bahar’ın ihtiyacı varmış gibi davranmıştır?",
    answers: [
      "Kabızlık ilacı",
      "Burağa XS Kondom 😂",
      "Mantar Kremi",
      "Göt Lavmanı"
    ],
    correct: 0,
    video: "bahar-pharmacy.mp4",
    timeLimit: 45
  },
  {
    id: 14,
    text: "Serbay, Bahar’la first date’lerinde Balca’yı arayıp ne demiştir?",
    answers: [
      "Bahar gelmedi bu arada",
      "Hesabı bölüşür mü yaa 🤠",
      "Kanka ilk date'den verir mi?",
      "İshal oldum altıma sıçacağım Balca yardım et"
    ],
    correct: 0,
    video: "bahar-date.mp4",
    timeLimit: 45
  },
  {
    id: 15,
    text: "Bahar, Kapadokya uçağında montunu almak için kendisini uyandıran hosta ne yapmıştır?",
    answers: [
      "“Napıyosun be!” diye bağırmıştır",
      "Uyanmamıştır",
      "“Çok sağ olun” diyip montunu vermiştir",
      "Hosta nah çekmiştir"
    ],
    correct: 3,
    photo: "bahar-plane.jpeg",
    timeLimit: 45
  },
  {
    id: 16,
    text: "Bahar Balca’yla ilk interaksiyonunda ne yapmıştır?",
    answers: [
      "“Merhaba Balca, ben Bahar” demiştir",
      "Kafasını çevirmiştir",
      "“X adlı çocuktan uzak dur, onun sevgilisi var” demiştir",
      "Götüne bakıp off la casa de casa ha demiştir"
    ],
    correct: 2,
    photo: "bahar-firstmeet.jpeg",
    timeLimit: 45
  },
  {
    id: 17,
    text: "Ortaokulda çok dramalı ve saçma bir şekilde Bahar’ı bile sinirlendirip kendine düşüren kız kimdir?",
    answers: ["Melis", "Duru Lal", "Elif", "İrem"],
    correct: 1,
    photo: "bahar-drama.jpeg",
    timeLimit: 45
  },
  {
    id: 18,
    text: "Bahar’ın erken 2010’larda dansını dini bi şekilde yaptığı şarkı hangisiydi?",
    answers: ["Bad Romance", "Gangnam Style", "Toxic", "Harlem Shake"],
    correct: 1,
    video: "bahar-dance.mp4",
    timeLimit: 45
  }
]


export const getRandomQuestions = (count: number = 5): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, questions.length))
}
