export const findBeaches = jest.fn().mockResolvedValue([
  {
    id: "mock-beach-1",
    name: "Praia Mockada",
    region: "north",
    description: "Praia usada apenas em testes.",
    waves: true,
    waterTemp: "warm",
    favourite: false,
  },
]);
