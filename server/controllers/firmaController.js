exports.saveSignature = async (req, res) => {
    const { signature } = req.body;
    console.log("Firma recibida:", signature);
    res.json({ success: true });
  };
  