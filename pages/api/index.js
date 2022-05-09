export default async (req, res) => {
  res.json({
    status: 'good',
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb',
      responseLimit: '500kb',
    },
  },
};
