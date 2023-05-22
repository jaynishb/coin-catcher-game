import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { truncateEthAddress } from "../utils";

const Row = ({ account, rank, highScore }) => {
    const { account: currentAccount } = useWeb3React()
  return (
    <tr className={`${currentAccount == account ? 'bg-teal-500 px-2 text-white font-bold' : '' }`}>
      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 text-left">
        {rank +1 }
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 ">
        {truncateEthAddress(account)}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
        <div className="flex items-center">
          <span className="mr-2">{highScore}</span>
        </div>
      </td>
    </tr>
  );
};

export const Leaderboard = ({ start }) => {
  const [data, setData] = useState([]);

  const getLeaderboard = () => axios.get(`${process.env.REACT_APP_BASE_URL}/leaderboard`).then(({ data: { data: values } }) => setData(values));

  useEffect(() => {
    getLeaderboard()
  }, []);

  useEffect(() => {
    console.log('startt called')
    getLeaderboard()
  }, [start])

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
            <th className="px-6 bg-blueGray-50 text-blueGray-700 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">Scores</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <Row {...row} rank={index}/>
          ))}
        </tbody>
      </table>
    </div>
  );
};
