import TransactionModel from "../../models/Transactiondb/Transaction.js";

export const Add = async (req, res) => {
  const { title, amount, type, date, icon, category, note } = req.body;
  const userId = req.userId;
  try {
    const addData = await TransactionModel.create({
      icon,
      title,
      amount,
      type,
      date,
      category,
      note,
      user: userId,
    });
    res.status(201).json({ message: "Data successfully submitted", data: addData });
  } catch (error) {
    console.error("Error during adding data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const Delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const deleted = await TransactionModel.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: "Transaction not found or unauthorized" });
    res.json({ message: "Transaction deleted", data: deleted });
  } catch (error) {
    console.error("Error during deleting data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const Get = async (req, res) => {
  try {
    const userId = req.userId;
    const filter = { user: userId, ...req.query };
    const transactions = await TransactionModel.find(filter).sort({ date: -1 });
    res.json({ data: transactions });
  } catch (error) {
    console.error("Error during fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const Edit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.userId;

    const updated = await TransactionModel.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }
    res.json({ message: "Transaction updated", data: updated });
  } catch (error) {
    console.error("Error during editing data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

