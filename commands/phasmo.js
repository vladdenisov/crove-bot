const items = [
  'Лазерный проектор',
  'Детекор ЭМП',
  'Блокнот',
  'Радиоприёмник',
  'УФ-Фонарик',
  'Видеокамера',
  'Свеча',
  'Распятие',
  'Датчик движения',
  'Направленный микрофон',
  'Благовоние',
  'Соль',
  'Успокоительное',
  'Мощный фонарь'
]

exports.run = async (_client, message) => {
  const item = items[Math.floor(Math.random() * items.length)]
  message.reply(item)
}

exports.help = {
  name: '`phasmo`',
  description: 'Gives random phasmo item',
  usage: 'phasmo'
}
