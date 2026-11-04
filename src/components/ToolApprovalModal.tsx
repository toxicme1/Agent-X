import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

export function ToolApprovalModal({ visible, tool, args, onApprove, onCancel }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Tool Approval</Text>
          <Text style={styles.tool}>{tool}</Text>
          <Text style={styles.args}>{JSON.stringify(args, null, 2)}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}><Text>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.approve]} onPress={onApprove}><Text style={{color:"#fff"}}>Approve</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  title: { fontSize: 18, fontWeight: "600" },
  tool: { marginTop: 8, fontWeight: "500" },
  args: { marginTop: 8, fontFamily: "monospace", backgroundColor: "#f7f7f7", padding: 8, borderRadius: 8 },
  row: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  btn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  cancel: { backgroundColor: "#eee" },
  approve: { backgroundColor: "#dc2626" },
});
