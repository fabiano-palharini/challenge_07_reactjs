export default (date: string): string => {
  const [parse] = date.split('T');
  const parseDate = parse.split('-');

  return Intl.DateTimeFormat('pt-br').format(
    new Date(
      Number(parseDate[0]),
      Number(parseDate[1]) - 1,
      Number(parseDate[2]),
    ),
  );
};
