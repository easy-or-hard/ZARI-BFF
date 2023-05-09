import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await ConstellationCreate();
  await userByeolZariCreate();
  await bannzzackCreate();
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

async function ConstellationCreate() {
  const Constellations = [
    {
      IAU: 'Ari',
      name: '양',
      startMonthDay: '03-21',
      endMonthDay: '04-19',
      constellationCount: 15,
      element: '불',
      rulingPlanet: '화성',
    },
    {
      IAU: 'Tau',
      name: '황소',
      startMonthDay: '04-20',
      endMonthDay: '05-20',
      constellationCount: 13,
      element: '흙',
      rulingPlanet: '금성',
    },
    {
      IAU: 'Gem',
      name: '쌍둥이',
      startMonthDay: '05-21',
      endMonthDay: '06-20',
      constellationCount: 14,
      element: '공기',
      rulingPlanet: '수성',
    },
    {
      IAU: 'Cnc',
      name: '게',
      startMonthDay: '06-21',
      endMonthDay: '07-22',
      constellationCount: 7,
      element: '물',
      rulingPlanet: '달',
    },
    {
      IAU: 'Leo',
      name: '사자',
      startMonthDay: '07-23',
      endMonthDay: '08-22',
      constellationCount: 12,
      element: '불',
      rulingPlanet: '태양',
    },
    {
      IAU: 'Vir',
      name: '처녀',
      startMonthDay: '08-23',
      endMonthDay: '09-22',
      constellationCount: 15,
      element: '흙',
      rulingPlanet: '수성',
    },
    {
      IAU: 'Lib',
      name: '천칭',
      startMonthDay: '09-23',
      endMonthDay: '10-22',
      constellationCount: 10,
      element: '공기',
      rulingPlanet: '금성',
    },
    {
      IAU: 'Sco',
      name: '전갈',
      startMonthDay: '10-23',
      endMonthDay: '11-21',
      constellationCount: 12,
      element: '물',
      rulingPlanet: '명왕성',
    },
    {
      IAU: 'Sgr',
      name: '궁수',
      startMonthDay: '11-22',
      endMonthDay: '12-21',
      constellationCount: 15,
      element: '불',
      rulingPlanet: '목성',
    },
    {
      IAU: 'Cap',
      name: '염소',
      startMonthDay: '12-22',
      endMonthDay: '01-19',
      constellationCount: 11,
      element: '흙',
      rulingPlanet: '토성',
    },
    {
      IAU: 'Aqr',
      name: '물병',
      startMonthDay: '01-20',
      endMonthDay: '02-18',
      constellationCount: 11,
      element: '공기',
      rulingPlanet: '천왕성',
    },
    {
      IAU: 'Psc',
      name: '물고기',
      startMonthDay: '02-19',
      endMonthDay: '03-20',
      constellationCount: 12,
      element: '물',
      rulingPlanet: '해왕성',
    },
  ];

  for (const constellation of Constellations) {
    await prisma.constellation.upsert({
      where: { name: constellation.name },
      update: {},
      create: {
        IAU: constellation.IAU,
        name: constellation.name,
        constellationCount: constellation.constellationCount,
        startMonth: +constellation.startMonthDay.split('-')[0],
        startDay: +constellation.startMonthDay.split('-')[1],
        endMonth: +constellation.endMonthDay.split('-')[0],
        endDay: +constellation.endMonthDay.split('-')[1],
      },
    });
  }

  return Promise.resolve();
}

async function userByeolZariCreate() {
  const constellationList = await prisma.constellation.findMany();

  for (const byeol of byeols) {
    const userInstance = await prisma.user.upsert({
      where: {
        provider_providerId: {
          provider: byeol.provider,
          providerId: byeol.providerId,
        },
      },
      update: {},
      create: {
        provider: byeol.provider,
        providerId: byeol.providerId,
      },
    });

    const constellation = getRandomElement(constellationList);
    await prisma.byeol.upsert({
      where: { name: byeol.name },
      update: {},
      create: {
        name: byeol.name,
        users: {
          connect: { id: userInstance.id },
        },
        zaris: {
          create: {
            constellationIAU: constellation.IAU,
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: userInstance.id },
      data: { role: UserRole.BYEOL },
    });
  }

  return Promise.resolve();
}

const byeols = [
  { name: '나루토', provider: 'local', providerId: 1 },
  { name: '사스케', provider: 'local', providerId: 2 },
  { name: '루피', provider: 'local', providerId: 3 },
  { name: '조로', provider: 'local', providerId: 4 },
  { name: '이치고', provider: 'local', providerId: 5 },
  { name: '나미', provider: 'local', providerId: 6 },
  { name: '루시', provider: 'local', providerId: 7 },
  { name: '에르자', provider: 'local', providerId: 8 },
  { name: '아스카', provider: 'local', providerId: 9 },
  { name: '신지', provider: 'local', providerId: 10 },
  { name: '쿄스케', provider: 'local', providerId: 11 },
  { name: '토루', provider: 'local', providerId: 12 },
  { name: '유키', provider: 'local', providerId: 13 },
  { name: '미코토', provider: 'local', providerId: 14 },
  { name: '라키', provider: 'local', providerId: 15 },
  { name: '레이', provider: 'local', providerId: 16 },
  { name: '미사토', provider: 'local', providerId: 17 },
  { name: '타카시', provider: 'local', providerId: 18 },
  { name: '히카루', provider: 'local', providerId: 19 },
  { name: '하루히', provider: 'local', providerId: 20 },
  { name: '리코', provider: 'local', providerId: 21 },
  { name: '카이', provider: 'local', providerId: 22 },
  { name: '시온', provider: 'local', providerId: 23 },
  { name: '유우', provider: 'local', providerId: 24 },
  { name: '마사', provider: 'local', providerId: 25 },
  { name: '코가', provider: 'local', providerId: 26 },
  { name: '레나', provider: 'local', providerId: 27 },
  { name: '아야', provider: 'local', providerId: 28 },
  { name: '마키', provider: 'local', providerId: 29 },
  { name: '켄타', provider: 'local', providerId: 30 },
  { name: '카논', provider: 'local', providerId: 31 },
  { name: '미치루', provider: 'local', providerId: 32 },
  { name: '유이', provider: 'local', providerId: 33 },
  { name: '유리코', provider: 'local', providerId: 34 },
];

async function bannzzackCreate() {
  const contents = [
    '안녕하세요! 오늘 하루도 행복한 일만 가득하시길 바랍니다.',
    '즐거운 하루 되세요! 그 어떤 일도 당신을 좌절시키지 못하도록 힘내세요.',
    '행운이 가득한 하루 되세요. 모든 일이 당신의 희망대로 이루어지길 바랍니다.',
    '안녕히 계세요! 조용한 하루 보내시길 바랍니다.',
    '좋은 하루 보내세요. 세상이 더욱 밝아지는 날이 되길 기원합니다.',
    '새로운 일에 도전하는 하루 되세요. 당신의 가능성은 무궁무진합니다.',
    '오늘 하루도 최선을 다하고 행복을 찾아보세요. 당신의 미래가 밝아질 것입니다.',
    '잘 다녀오세요. 언제든지 당신을 응원합니다.',
    '다음에 또 뵙겠습니다. 행운이 당신과 함께하기를 기원합니다.',
    '건강하고 행복한 하루 되세요. 오늘도 당신은 특별합니다.',
    '화이팅! 모든 것이 당신의 희망대로 일어날 것입니다.',
    '푹 쉬세요. 내일은 더욱 더 잘 할 수 있습니다.',
    '감기 조심하세요. 몸조리 잘 하시길 바랍니다.',
    '고생 많으셨어요. 모든 것이 보람찬 일이 되길 기원합니다.',
    '좋은 소식 들어왔으면 좋겠어요. 당신의 행운이 무궁무진하기를 기원합니다.',
    '건강한 하루 보내세요. 당신이 행복한 모습으로 돌아오길 기대합니다.',
    '일 잘하고 오세요. 모든 일이 당신의 희망대로 이루어질 것입니다.',
    '고맙습니다. 당신과 함께할 수 있어서 감사합니다.',
    '화이팅! 오늘도 힘내세요. 당신은 놀라운 일을 이룰 수 있습니다.',
    '여유로운 하루 보내세요. 마음의 여유가 당신의 인생을 더욱 풍요롭게 만들어줄 것입니다.',
    '행운이 항상 당신과 함께하기를 기원합니다. 오늘 하루도 행복하세요.',
    '조심히 가세요. 당신의 안전이 최우선입니다.',
    '건강한 일상을 유지하세요. 당신의 몸과 마음에 귀를 기울이세요.',
    '또 뵈요. 당신을 다시 만날 때까지 건강하고 행복하길 기원합니다.',
    '다음에 또 만나요. 당신과 함께한 시간은 소중한 추억이 될 것입니다.',
    '잘 부탁드립니다. 당신의 가능성을 믿습니다.',
    '고맙습니다. 당신의 도움에 감사합니다.',
    '조심해서 가세요. 모든 일이 당신의 희망대로 이루어질 것입니다.',
    '괜찮아질 거예요. 당신은 모든 상황을 이겨낼 수 있습니다.',
    '기운 내세요. 당신의 행운이 항상 함께하기를 기원합니다.',
    '당신은 특별합니다. 행복한 하루 보내세요.',
    '힘내서 해보세요. 당신의 가능성은 무궁무진합니다.',
    '소중한 하루 보내세요. 오늘도 당신은 특별합니다.',
    '화이팅! 내일은 더욱 더 잘할 수 있습니다.',
    '감사합니다. 당신과 함께한 시간은 소중한 추억이 될 것입니다.',
    '건강하고 행복한 하루 되세요. 모든 일이 당신의 희망대로 이루어지길 기원합니다.',
    '언제든지 당신을 지지합니다. 당신의 미래에 대해 무한한 기대를 가지고 있습니다.',
    '모든 일이 당신의 희망대로 이루어지길 기원합니다. 당신은 놀라운 일을 이룰 수 있습니다.',
    '오늘도 최선을 다하고 행복을 찾아보세요. 당신의 미래가 밝아질 것입니다.',
    '즐거운 휴식을 취하세요. 당신은 자신에게 필요한 휴식을 가장 잘 압니다.',
    '당신이 원하는 모든 것을 이루기를 기원합니다. 행복한 하루 보내세요.',
    '건강과 행복이 함께하기를 기원합니다. 모든 일이 당신의 희망대로 이루어질 것입니다.',
    '살아있으니 다행이에요! 좋은 하루 되세요.',
    '안녕하세요, 오늘 하루도 힘내세요!',
    '지금부터 좋은 일만 생길거에요. 화이팅!',
    '좋은 기운이 가득한 하루 보내세요!',
    '행복한 하루 보내시길 바랍니다. 오늘도 당신은 최고예요.',
    '하루하루가 행복하고 즐거운 일만 가득하길 바랍니다.',
    '새로운 출발을 응원합니다! 오늘도 화이팅!',
    '오늘 하루도 웃음 가득하길 기원합니다.',
    '불금에는 즐기고 월요일에는 힘내세요!',
    '행복한 마음으로 하루를 시작하세요. 모든 일이 행복하게 마무리 됩니다.',
    '힘들더라도 흔들리지 마세요. 당신은 충분히 강합니다.',
    '기쁨과 행복이 가득한 하루 되세요.',
    '모든 것이 잘되기를 기원합니다. 오늘 하루도 힘내세요!',
    '세상에서 가장 행복한 사람이 되세요!',
    '새로운 시작을 응원합니다. 오늘도 화이팅하세요.',
    '하루하루 미소를 잃지 말고 즐겁게 보내세요.',
    '행복한 하루 시작되길 바랍니다. 당신은 특별합니다.',
    '일의 어려움이 당신의 능력을 더욱 높이게 만들 거에요.',
    '자신감 가득한 하루 보내세요. 당신은 멋진 사람입니다.',
    '괜찮아요. 오늘 하루만 힘내보아요!',
    '지친 하루 끝, 힘든 하루가 지나가고 행복한 내일이 찾아올 거예요.',
    '일상에 지친 당신, 오늘 하루는 쉬어가세요.',
    '즐거운 마음으로 하루를 시작해보아요.',
    '긍정적인 생각이 우리의 삶을 바꿔놓는다는 걸 잊지 마세요.',
    '행복과 즐거움이 넘치는 하루 되세요.',
    '새로운 일을 시작할 때면, 항상 믿음과 강한 의지가 필요합니다.',
    '오늘 하루도 무사히 마무리하시길 바랍니다.',
  ];

  const byeolList = await prisma.byeol.findMany();
  for (const content of contents) {
    const randomByeol = getRandomElement(byeolList);
    const zari = await prisma.zari.findMany({
      include: {
        banzzacks: true,
        constellation: true,
      },
    });
    const randomZari = getRandomElement(zari);

    if (randomZari.banzzacks.length >= randomZari.constellationCount) {
      continue;
    }
    try {
      await prisma.banzzack.create({
        data: {
          content: content,
          byeolId: randomByeol.id,
          byeolName: randomByeol.name,
          zariId: randomZari.id,
          starNumber: randomZari.banzzacks.length + 1,
        },
      });
    } catch (error) {
      console.log('-----------------------------------------------------');
      console.log(randomZari.id);
      console.log(randomZari.banzzacks.length);
    }
  }
}
