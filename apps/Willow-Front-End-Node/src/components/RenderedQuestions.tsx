import { QuestionsMap } from "@monorepo/utils";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";

export const RenderedQuestions = React.memo(
  ({ analysis }: { analysis: QuestionsMap }) => {
    return (
      <Box>
        {Object.entries(analysis).map(([question, data], index) => (
          <Paper key={index} sx={{ margin: 2, padding: 2 }}>
            <Typography variant="h6">{question}</Typography>
            <Typography variant="body1">
              <strong>Answer:</strong> {data.Answer}
            </Typography>
            <Typography variant="body2">
              <strong>Explanation:</strong> {data.Explanation}
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  }
);
