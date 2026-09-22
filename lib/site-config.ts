export const siteConfig = {
  name: 'Tesoob',
  instagram: 'https://www.instagram.com/vistatesoob/',
  creatorInstagram: 'https://www.instagram.com/luciorique02/',
  email: 'tesoob.site@gmail.com',
  locality: 'Campos Gerais, Minas Gerais',
};

export type OrderInput = { reference?: string };

export function orderMessage(input: OrderInput = {}) {
  if (!input.reference)
    return 'Oi, Tesoob! Vim pelo site e gostaria de conversar sobre uma encomenda.';
  return [
    'Oi, Tesoob! Vim pelo site e tenho interesse nesta referência:',
    input.reference,
    '',
    'Queria saber sobre valores, disponibilidade e possibilidades para encomendar.',
  ].join('\n');
}
