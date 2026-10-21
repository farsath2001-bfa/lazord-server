// Inserts three DRAFT articles (unpublished) so you can review and edit them in Admin → Blog.
// Run once from the lazord-server folder:   node seed/seedPosts.js
// Review everything before publishing: rules and fees change, and the Arabic text needs a native speaker.
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Post = require('../models/Post')

const posts = [
  {
    slug: 'buying-property-in-dubai-step-by-step',
    title: 'Buying Property in Dubai: A Step-by-Step Guide for First-Time Buyers',
    titleAr: 'شراء عقار في دبي: دليل خطوة بخطوة للمشترين لأول مرة',
    category: 'Buying Guide',
    tags: ['buying', 'guide', 'first-time buyer'],
    excerpt: 'From setting a budget to receiving the title deed, here is how a typical purchase in Dubai works and what to check at each stage.',
    excerptAr: 'من تحديد الميزانية إلى استلام سند الملكية، إليك كيف تتم عملية الشراء المعتادة في دبي وما يجب التحقق منه في كل مرحلة.',
    content: `Buying your first property in Dubai is easier when you know the order of the steps. This guide gives a general overview. Rules, fees and requirements can change, so always confirm the current details with your advisor before you commit.

## 1. Set your budget
Decide how much you can pay upfront and how much you may need to borrow. Remember that the price is not the only cost. Budget for government registration fees, agency fees, and for ongoing service charges.

## 2. Choose the area and property type
Think about how you will use the property: live in it, rent it out, or hold it as an investment. Our [area guides](/areas) can help you compare neighbourhoods.

## 3. Agree the price and sign the sales agreement
Once you and the seller agree on a price, a sales agreement is signed and a deposit is usually paid. Read it carefully and ask your agent to explain anything unclear.

## 4. Pay the fees and complete the transfer
For a ready property, the transfer is completed at a registration centre once the remaining conditions are met. You then receive the title deed in your name.

## 5. Plan for ongoing costs
After the purchase you will pay service charges and utilities, and possibly property management if you rent the home out. Use our [rental yield calculator](/investment-tools?tool=yield) to see what you may earn after costs.

## What to check before you buy
- The seller's right to sell the property
- Service charges and any outstanding balances
- The developer's track record, for off-plan projects
- Your mortgage options, if you need finance, using our [mortgage calculator](/investment-tools?tool=mortgage)

> Not sure where to start? Our team can walk you through each step.`,
    contentAr: `يصبح شراء أول عقار لك في دبي أسهل عندما تعرف ترتيب الخطوات. يقدّم هذا الدليل نظرة عامة. قد تتغير القواعد والرسوم والمتطلبات، لذا تأكد دائماً من التفاصيل الحالية مع مستشارك قبل الالتزام.

## 1. حدّد ميزانيتك
قرّر كم يمكنك دفعه مقدماً وكم قد تحتاج إلى اقتراضه. تذكّر أن السعر ليس التكلفة الوحيدة. خصّص ميزانية لرسوم التسجيل الحكومية ورسوم الوساطة ورسوم الخدمة المستمرة.

## 2. اختر المنطقة ونوع العقار
فكّر في كيفية استخدام العقار: السكن فيه أو تأجيره أو الاحتفاظ به كاستثمار. يمكن لـ [أدلة المناطق](/areas) مساعدتك في مقارنة الأحياء.

## 3. اتفق على السعر ووقّع اتفاقية البيع
بعد اتفاقك مع البائع على السعر، يتم توقيع اتفاقية البيع ويُدفع عادةً مبلغ مقدّم. اقرأها بعناية واطلب من وسيطك شرح أي بند غير واضح.

## 4. ادفع الرسوم وأكمل نقل الملكية
بالنسبة للعقار الجاهز، تُستكمل عملية النقل في مركز التسجيل بعد استيفاء الشروط المتبقية. وبعدها تتسلم سند الملكية باسمك.

## 5. خطّط للتكاليف المستمرة
بعد الشراء ستدفع رسوم الخدمة والمرافق، وربما إدارة العقار إذا أجّرته. استخدم [حاسبة عائد الإيجار](/investment-tools?tool=yield) لمعرفة ما قد تربحه بعد التكاليف.

## ما يجب التحقق منه قبل الشراء
- حق البائع في بيع العقار
- رسوم الخدمة وأي مبالغ مستحقة
- سجل المطوّر، في المشاريع على الخارطة
- خيارات التمويل العقاري إن احتجت، عبر [حاسبة الرهن العقاري](/investment-tools?tool=mortgage)

> لست متأكداً من أين تبدأ؟ يمكن لفريقنا إرشادك في كل خطوة.`
  },
  {
    slug: 'off-plan-vs-ready-property-dubai',
    title: 'Off-Plan vs Ready Property in Dubai: Which Is Right for You?',
    titleAr: 'العقار على الخارطة أم الجاهز في دبي: أيهما يناسبك؟',
    category: 'Investment',
    tags: ['off-plan', 'ready', 'investment'],
    excerpt: 'Both options can work well. Here is how they compare on payment, risk, timing and flexibility.',
    excerptAr: 'يمكن أن ينجح كلا الخيارين. إليك مقارنة بينهما من حيث الدفع والمخاطر والتوقيت والمرونة.',
    content: `One of the first questions buyers ask is whether to buy off plan or buy a finished home. The answer depends on your goals, your budget and how soon you need the property.

## Off-plan properties
You buy before or during construction, usually with a payment plan spread over the build period.
- **Pros:** staged payments, a wider choice of units and layouts, and a modern building on completion.
- **Cons:** you wait for handover, completion dates can move, and you cannot see the finished unit beforehand.

## Ready properties
You buy a completed home that you can move into or rent out soon after the transfer.
- **Pros:** you see exactly what you are buying, you can start renting sooner, and the community already exists.
- **Cons:** you usually pay the full price in a short time, and the choice of brand-new units may be smaller.

## How to decide
- **Need rental income quickly?** Ready is often simpler.
- **Prefer to pay in stages?** Off plan may suit your cash flow.
- **Want to live in it?** Ready gives certainty on the move-in date.

Whichever you choose, check the developer's track record and the terms of the sales agreement. Use our [payment plan tool](/investment-tools?tool=plan) to see how an off-plan schedule looks in practice.

> Want help comparing specific projects? Talk to our team.`,
    contentAr: `من أول الأسئلة التي يطرحها المشترون: هل أشتري على الخارطة أم منزلاً جاهزاً؟ تعتمد الإجابة على أهدافك وميزانيتك ومدى حاجتك السريعة للعقار.

## العقارات على الخارطة
تشتري قبل البناء أو أثناءه، وعادةً مع خطة دفع موزعة على فترة الإنشاء.
- **المزايا:** دفعات مرحلية، واختيار أوسع من الوحدات والتصاميم، ومبنى حديث عند الإنجاز.
- **العيوب:** تنتظر التسليم، وقد تتغير مواعيد الإنجاز، ولا يمكنك رؤية الوحدة النهائية مسبقاً.

## العقارات الجاهزة
تشتري منزلاً مكتملاً يمكنك السكن فيه أو تأجيره بعد النقل بوقت قصير.
- **المزايا:** ترى بالضبط ما تشتريه، ويمكنك البدء بالتأجير أبكر، والمجتمع قائم بالفعل.
- **العيوب:** غالباً تدفع السعر كاملاً في وقت قصير، وقد يكون الاختيار من الوحدات الجديدة كلياً أقل.

## كيف تقرر
- **تحتاج دخلاً إيجارياً سريعاً؟** الجاهز غالباً أبسط.
- **تفضّل الدفع على مراحل؟** قد يناسب العقار على الخارطة تدفقك النقدي.
- **تريد السكن فيه؟** الجاهز يمنحك يقيناً بموعد الانتقال.

أياً كان اختيارك، تحقق من سجل المطوّر وشروط اتفاقية البيع. استخدم [أداة خطة الدفع](/investment-tools?tool=plan) لترى كيف يبدو جدول الدفع على الخارطة عملياً.

> تريد مساعدة في مقارنة مشاريع محددة؟ تحدث مع فريقنا.`
  },
  {
    slug: 'how-to-calculate-rental-yield-dubai',
    title: 'How to Calculate Rental Yield on a Dubai Property',
    titleAr: 'كيف تحسب عائد الإيجار على عقار في دبي',
    category: 'Investment',
    tags: ['rental yield', 'roi', 'investment'],
    excerpt: 'Gross yield is quick but net yield is the real number. Here is the simple formula and what to include.',
    excerptAr: 'العائد الإجمالي سريع الحساب لكن العائد الصافي هو الرقم الحقيقي. إليك المعادلة البسيطة وما يجب تضمينه.',
    content: `Rental yield tells you how much a property earns each year compared with what you paid. It is one of the simplest ways to compare investments.

## Gross yield
**Gross yield = annual rent ÷ purchase price × 100**

For example, a property bought for AED 1,000,000 that rents for AED 70,000 a year has a gross yield of 7%.

## Net yield
Gross yield ignores your costs. Net yield is closer to what you actually keep.

**Net yield = (annual rent − costs) ÷ total amount invested × 100**

Costs to include:
- Service charges
- Property management fees, if you use an agent
- Periods when the property is empty
- Maintenance and repairs

And for the amount invested, include the purchase costs as well as the price.

## Tips
- Compare net yield, not gross yield, between properties.
- Use realistic rent and vacancy assumptions, not the best case.
- Remember that yield is only one measure. Location and long-term demand matter too.

Try the numbers yourself with our [rental yield calculator](/investment-tools?tool=yield).

> These examples are illustrations, not predictions of what any property will earn.`,
    contentAr: `يخبرك عائد الإيجار بمقدار ما يدرّه العقار سنوياً مقارنة بما دفعته. وهو من أبسط الطرق لمقارنة الاستثمارات.

## العائد الإجمالي
**العائد الإجمالي = الإيجار السنوي ÷ سعر الشراء × 100**

مثلاً، عقار اشتُري بمبلغ 1,000,000 درهم ويُؤجَّر بـ 70,000 درهم سنوياً عائده الإجمالي 7%.

## العائد الصافي
يتجاهل العائد الإجمالي تكاليفك. أما العائد الصافي فهو أقرب إلى ما تحتفظ به فعلاً.

**العائد الصافي = (الإيجار السنوي − التكاليف) ÷ إجمالي المبلغ المستثمر × 100**

التكاليف التي يجب تضمينها:
- رسوم الخدمة
- رسوم إدارة العقار إن استعنت بوسيط
- فترات خلو العقار
- الصيانة والإصلاحات

وفي المبلغ المستثمر، ضمّن تكاليف الشراء إضافة إلى السعر.

## نصائح
- قارن العائد الصافي لا الإجمالي بين العقارات.
- استخدم افتراضات واقعية للإيجار والشغور، لا أفضل الحالات.
- تذكّر أن العائد مقياس واحد فقط. الموقع والطلب على المدى الطويل مهمان أيضاً.

جرّب الأرقام بنفسك مع [حاسبة عائد الإيجار](/investment-tools?tool=yield).

> هذه الأمثلة توضيحية وليست توقعاً لما سيدرّه أي عقار.`
  }
]

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  let added = 0
  for (const p of posts) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await Post.exists({ slug: p.slug })
    if (exists) { console.log('skip (already exists):', p.slug); continue }
    // eslint-disable-next-line no-await-in-loop
    await Post.create({ ...p, published: false })
    added += 1
    console.log('added draft:', p.slug)
  }
  console.log(`Done. ${added} draft(s) added. Open Admin → Blog to review and publish.`)
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
