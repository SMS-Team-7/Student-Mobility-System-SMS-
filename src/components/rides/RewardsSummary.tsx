import ShineIcon from "../../assets/profile-icons/shine.svg?react";
const RewardsSummary = ({
  totalEarned,
  redeemed,
  available,
}: {
  totalEarned: number;
  redeemed: number;
  available: number;
}) => {
  const pct = Math.round(((totalEarned - redeemed) / totalEarned) * 100);

  return (
    <div className="bg-black/5 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            <ShineIcon />
          </div>
          <div className="text-lg font-bold">Rewards</div>
        </div>
        <div>
          <div className="text-sm text-pri px-2 py-px bg-pri/15 rounded-2xl">
            See all
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <div className="text-sm text-gray-500">Total Earned</div>
          <div className="text-2xl font-bold text-green-600">
            {totalEarned.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Redeemed</div>
          <div className="text-2xl font-bold">{redeemed.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Available</div>
          <div className="text-2xl font-bold text-blue-600">
            {available.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400"
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
};
export default RewardsSummary;
