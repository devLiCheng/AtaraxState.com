const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log('Cleared existing data.');

  // 2. Create Admin
  const adminPassword = bcrypt.hashSync('admin', 10);
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: adminPassword,
    },
  });
  console.log('Created Admin user:', admin.username);

  // 3. Create Products
  const products = [
    {
      nameZh: '阿塔拉克西亚 - 火山石手串',
      nameEn: 'Ataraxia - Volcanic Stone Bracelet',
      price: 79.00,
      storyZh: '在喧嚣的日常中，指尖触碰粗糙的火山石，是唤醒内心宁静（Ataraxia）的锚点。它沉稳、克制，沉淀了时间的温热。',
      storyEn: 'In the bustle of daily life, touching the raw volcanic stone is the anchor to awaken your inner peace (Ataraxia). Restrained, calm, it carries the warmth of time.',
      detailsZh: '哑光天然火山石 (8mm) | 磨砂黑曜石隔珠 | 做旧哑光纯银配饰 | 优质进口弹力绳 | 适合手围：16-18cm',
      detailsEn: 'Matte Natural Volcanic Stone (8mm) | Frosted Obsidian Spacer | Distressed Sterling Silver Accents | High-grade Stretch Cord | Fits wrist: 16-18cm',
      careZh: '避免接触化学溶剂，可用干净的软布轻轻擦拭，避免强力拉扯。',
      careEn: 'Avoid contact with chemicals. Wipe gently with a clean soft cloth. Avoid excessive pulling.',
      images: '/images/products/volcanic-stone-1.png',
      category: 'bracelet',
      stock: 99,
    },
    {
      nameZh: '无调性 - 燕麦玛瑙手串',
      nameEn: 'Atonal - Oatmeal Agate Bracelet',
      price: 95.00,
      storyZh: '低饱和度的燕麦色玛瑙，带着岩石的冰凉与温润。它是对物性本源的探寻，温和却富有力量，是手腕上的理性伴侣。',
      storyEn: 'Low-saturation oatmeal agate carrying the coolness and warmth of stone. An exploration of the essence of material, gentle yet powerful, a rational companion on your wrist.',
      detailsZh: '精选燕麦色玛瑙 (10mm) | 磨砂做旧黄铜饰件 | 原生态手工质感 | 适合手围：17-19cm',
      detailsEn: 'Selected Oatmeal Agate (10mm) | Frosted Distressed Brass Accents | Raw Handcrafted Finish | Fits wrist: 17-19cm',
      careZh: '避免重力碰撞，洗澡或游泳时建议取下，用温水清洗后用软布擦干。',
      careEn: 'Avoid hard impact. Remove before showering or swimming. Clean with lukewarm water and dry with a soft cloth.',
      images: '/images/products/oatmeal-agate-1.png',
      category: 'bracelet',
      stock: 99,
    },
    {
      nameZh: '余白 - 深焙胡桃木手串',
      nameEn: 'Yubai - Deep Roast Walnut Bracelet',
      price: 69.00,
      storyZh: '选用经过数次深焙打磨的胡桃木珠，保留木质的自然肌理与触感。随着日常佩戴，光泽渐润，是内心沉淀的静默见证。',
      storyEn: 'Made of deep-roasted, polished walnut beads, retaining the natural texture and touch of wood. With daily wear, its lustre deepens, a silent witness to inner peace.',
      detailsZh: '老矿深焙胡桃木珠 (12mm) | 哑光黑曜石主珠 | 做旧银制搭扣 | 适合手围：16.5-18.5cm',
      detailsEn: 'Aged Deep-roasted Walnut Beads (12mm) | Matte Obsidian Main Bead | Distressed Silver Clasp | Fits wrist: 16.5-18.5cm',
      careZh: '木质饰品应避免沾水，汗液过多时应及时擦拭，定期使用橄榄油保养可增添包浆光泽。',
      careEn: 'Avoid water contact for wood products. Wipe off sweat immediately. Regular care with oil enhances its organic patina.',
      images: '/images/products/walnut-bead-1.png',
      category: 'bracelet',
      stock: 99,
    },
    {
      nameZh: '山脊线 - 哑光纯银项链',
      nameEn: 'Ridge Line - Matte Silver Necklace',
      price: 129.00,
      storyZh: '以粗犷的岩石脊线为灵感，摒弃过度打磨。哑光拉丝工艺呈现出沉稳的冷灰色调，贴近颈部，带来理性克制的安全感。',
      storyEn: 'Inspired by the rugged ridge lines of wild rocks, rejecting over-polishing. The brushed matte finish presents a calm cool grey tone, resting close to the neck.',
      detailsZh: 'S925纯银吊坠 (20x10mm) | 哑光拉丝山脊纹理 | 纯银十字链 (55cm) | 弹簧扣设计',
      detailsEn: 'S925 Sterling Silver Pendant (20x10mm) | Brushed Matte Ridge Texture | Sterling Silver Cable Chain (55cm) | Spring ring clasp',
      careZh: '纯银置于空气中易氧化，佩戴后建议放于密封袋中，氧化后可用擦银布恢复光泽。',
      careEn: 'Silver oxidizes naturally in air. Store in a sealed bag when not in use. Use a polishing cloth to restore shine if oxidized.',
      images: '/images/products/silver-ridge-1.png',
      category: 'necklace',
      stock: 99,
    },
  ];

  for (const prod of products) {
    const p = await prisma.product.create({
      data: prod,
    });
    console.log('Created product:', p.nameEn);
  }

  // 4. Create Articles
  const articles = [
    {
      titleZh: '宁静哲学：在喧嚣中寻获你的锚点',
      titleEn: 'The Philosophy of Ataraxia: Finding Your Anchor in a Noisy World',
      summaryZh: '在这个高速运转、信息冗余的时代，我们该如何保持内心的宁静？本文将探讨古希腊伊壁鸠鲁的“Ataraxia”哲学，以及如何通过手腕上的物件，为心灵找到停泊的锚点。',
      summaryEn: 'In an era of hyper-speed and information overload, how do we maintain inner peace? This article explores the ancient Greek Epicurean philosophy of "Ataraxia" and how physical anchors can ground the soul.',
      contentZh: `### 什么是 Ataraxia？

源自古希腊语的 **Ataraxia（阿塔拉克西亚）**，意为“灵魂的宁静、不受干扰的状态”。这是哲学家伊壁鸠鲁和皮浪所追求的最高精神境界。在他们看来，人生的终极幸福并非追求感官上的狂欢，而是消除内心的恐惧与焦虑，达到一种像止水般平静的觉知状态。

### 现代生活中的喧嚣与失重

我们每天被各种消息通知、会议日程、算法推荐所包围。我们的注意力被切割成无数个碎片，心灵时刻处于应激和防御状态。我们渴望安静，却又害怕失去链接。在这种无形的重力下，我们逐渐失去了“自我锚定”的能力。

### 手腕上的锚点

手串在很多文化中都承载着精神寄托。对我们而言，它不仅是一件首饰，而是一个**触觉的开关**。

当你感到焦虑、心神不宁时，用指尖轻轻摩挲火山石粗糙的质感，或者转动冰凉的玛瑙。那种真实的重力感、冰冷感和粗糙感，会将你飘忽的注意力拉回到当下，拉回到此时此刻。这就是你的 Ataraxia 锚点。

它用物理的触感提醒你：在这个世界里，有些质地是不会变的。外界再嘈杂，手腕上的这串沉淀，依然安稳。`,
      contentEn: `### What is Ataraxia?

Derived from the Ancient Greek **Ataraxia**, it means 'untroubled and tranquil mind; peace of soul'. This is the supreme spiritual pursuit of Epicurus and Pyrrho. For them, ultimate happiness is not sensory indulgence, but the removal of fear and anxiety, achieving a calm, self-contained awareness.

### The Noise of Modernity

Every day we are surrounded by notifications, meetings, and algorithmic recommendations. Our attention is fragmented, and our minds are in a perpetual state of stress. We long for peace, yet fear disconnection. Under this invisible pressure, we lose the ability to self-anchor.

### The Anchor on Your Wrist

Bracelets have carried spiritual weight in many cultures. For us, a bracelet is a **tactile switch**.

When you feel anxious or scattered, touch the rough volcanic stone or feel the cool oat agate on your wrist. That physical weight, coldness, and raw texture pulls your scattered awareness back to the present moment, back to the here and now. This is your Ataraxia anchor.

It reminds you through physical contact: in this world, some textures remain unchanged. No matter the noise outside, this piece on your wrist remains steady.`,
      coverImage: '/images/articles/ataraxia-philosophy-1.png',
      slug: 'philosophy-of-ataraxia-finding-inner-peace',
      keywords: 'Ataraxia, Inner Peace, Minimalist Bracelet, Men Jewelry Philosophy',
    },
    {
      titleZh: '克制美学：为什么低饱和度更有力量',
      titleEn: 'The Aesthetics of Restraint: Why Low Saturation Speaks Louder',
      summaryZh: '从 Aesop 到 COS，克制的美学正成为现代都市人无声的宣言。摒弃闪耀与张扬，低饱和度的大地色、做旧银与木质肌理，如何以沉默的姿态表达深邃的自我？',
      summaryEn: 'From Aesop to COS, the aesthetics of restraint is becoming a silent declaration. Rejecting flashiness and ostentation, how do earth tones, distressed silver, and wood textures express a deep self in silence?',
      contentZh: `### 拒绝“大声喧哗”的视觉

我们生活在一个极其嘈杂的视觉环境里。大面积的高饱和度色彩、刺眼的金色、闪烁的霓虹，都在试图拼命抢夺我们的视线。但在美学中，越是急于证明的，往往越显单薄。

相反，低饱和度的大地色系、燕麦色、深炭灰，是**退让的美学**。它不急于吸引你，而是静静地等在那里。当你把视线投向它时，你看到的是岩石的斑驳、黄铜氧化后的暗淡、木纹的呼吸。这些颜色里，有时间流过的痕迹。

### 材质的本真物理性

我们选择手链的材质时，避开了所有经过过度打磨、涂抹亮漆、反光严重的材质。我们偏爱火山石、燕麦色玛瑙、焙烧胡桃木和哑光银。因为它们保留了“物的本质”。

一件好的首饰不需要替你吹嘘财富或地位。它应当是低调的、日常的，像你身体的一部分，在冷淡的西装袖口下，隐约露出一截哑光木纹或做旧金属。这种克制的审美，正是最高级的男士气质。`,
      contentEn: `### Rejecting Loud Visuals

We live in an extremely loud visual environment. Bright gold, neon flashes, and high-saturation colors compete desperately for our attention. Yet in aesthetics, that which is loudest is often thinnest.

In contrast, low-saturation earth tones, oatmeal, and deep carbon grey represent the **aesthetics of withdrawal**. They do not shout; they wait. When you look closely, you see the mottling of rock, the patina of oxidized brass, the breathing of wood grain. These tones carry the trace of time.

### Honoring the Material

In choosing materials, we avoid high-shine lacquers, plastic acrylics, and over-polished metals. We lean toward volcanic stone, oat agate, roasted walnut, and matte silver. They preserve the raw state of matter.

A fine piece of jewelry does not need to boast of status. It should be low-key, daily, and become a natural part of you. This restrained aesthetic is the ultimate expression of quiet masculinity.`,
      coverImage: '/images/articles/aesthetics-restraint-1.png',
      slug: 'aesthetics-of-restraint-low-saturation',
      keywords: 'Minimalist Aesthetics, Earth Tones, Mens Jewelry, Quiet Luxury',
    },
  ];

  for (const art of articles) {
    const a = await prisma.article.create({
      data: art,
    });
    console.log('Created article:', a.titleEn);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
