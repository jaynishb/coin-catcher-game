import { truncateEthAddress } from "../utils";

const Row = ({ account, rank, points }) => {
  return (
    <tr>
      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
        {rank}
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 ">
        {truncateEthAddress(account)}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
        <div className="flex items-center">
          <span className="mr-2">{points}</span>
        </div>
      </td>
    </tr>
  );
};

export const Leaderboard = () => {
  const data = [
    {
      account: "0xunjkicelncoenrceorcneoicnoieipcomeoircme",
      rank: 1,
      points: 300,
    },
    {
      account: "0xunjkicelncoenrceorcneoicnoieipcomeoircme",
      rank: 2,
      points: 290,
    },
    {
      account: "0xunjkicelncoenrceorcneoicnoieipcomeoircme",
      rank: 3,
      points: 289,
    },
    {
      account: "0xunjkicelncoenrceorcneoicnoieipcomeoircme",
      rank: 4,
      points: 153,
    },
    {
      account: "0xunjkicelncoenrceorcneoicnoieipcomeoircme",
      rank: 5,
      points: 100,
    },
  ];

  return (
    <div className="block w-full overflow-x-auto border-2 rounded">
      <table className="items-center w-full border-collapse text-blueGray-700  ">
        <thead className="thead-light ">
          <tr>
            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              # Rank
            </th>
            <th className="px-6 bg-blWueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              # Account
            </th>
            <th className="px-6 bg-blueGray-50 text-blueGray-700 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Row {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
