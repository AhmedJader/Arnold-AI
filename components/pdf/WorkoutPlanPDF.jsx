"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Optional: register custom font
// Font.register({ family: 'Inter', src: 'path-to-font/Inter-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 18,
    color: "#2e7d32",
    marginBottom: 12,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  divider: {
    borderBottom: "1px solid #ccc",
    marginVertical: 8,
  },
  muscleHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
  },
  workoutBox: {
    padding: 6,
    border: "1pt solid #ccc",
    borderRadius: 4,
    marginBottom: 8,
  },
  small: {
    fontSize: 9,
    color: "#444",
  },
});

const WorkoutPlanPDF = ({ exportDate, muscles }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Muscle Workout Plan Export</Text>
      <Text style={styles.text}>Date Exported: {exportDate}</Text>
      <Text style={styles.text}>Total Muscles Selected: {muscles.length}</Text>

      {muscles.map((muscle, i) => (
        <View key={i} wrap={false}>
          <Text style={styles.sectionTitle}>
            {i + 1}. {muscle.name.toUpperCase()}
          </Text>

          {muscle.description && (
            <Text style={styles.text}>Description: {muscle.description}</Text>
          )}

          {muscle.primaryFunctions?.length > 0 && (
            <Text style={styles.text}>
              Primary Functions: {muscle.primaryFunctions.join(", ")}
            </Text>
          )}

          {muscle.workouts?.length > 0 && (
            <>
              <Text style={[styles.text, { marginTop: 6 }]}>Workouts:</Text>
              {muscle.workouts.map((workout, j) => (
                <View key={j} style={styles.workoutBox}>
                  <Text style={styles.muscleHeader}>{workout.name}</Text>
                  <Text style={styles.small}>
                    Type: {workout.type} | Equipment: {workout.equipment}
                  </Text>
                  <Text style={styles.small}>
                    Sets & Reps: {workout.sampleSetsReps}
                  </Text>
                  <Text style={styles.small}>Cues: {workout.cues}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      ))}
    </Page>
  </Document>
);

export default WorkoutPlanPDF;
