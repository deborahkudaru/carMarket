// import { useListCarForSale } from "../hooks/useCarDealer";

// const ListCarForSale = () => {
//   const {
//     carId,
//     setCarId,
//     price,
//     setPrice,
//     listCarForSale,
//     isLoading,
//     isSuccess,
//   } = useListCarForSale();
//   return (
//     <div>
//       <label>Car ID:</label>
//       <input
//         type="text"
//         value={carId}
//         onChange={(e) => setCarId(e.target.value)}
//       />
//       <label>Price (ETH):</label>
//       <input
//         type="text"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />
//       <button onClick={listCarForSale} disabled={isLoading}>
//         {isLoading ? "Processing..." : "List For Sale"}
//       </button>
//       {isSuccess && <div>Car listed for sale successfully!</div>}
//     </div>
//   );
// };

// export default ListCarForSale;
